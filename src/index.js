/*
 *
 * Service
 * (default)
 *
 */

(() => {

  /*
  Dependencies
  */

  const { http } = require('node-service-client');
  const drv = require('drv-core');

  const identity = require('identity-client');
  const fern = require('fern-client');

  const {
    SERVER_ERROR,
    BAD_REQUEST,
    INVALID_TOKEN_ERROR,
    USER_NOT_FOUND_ERROR,
    INSUFFICIENT_FUNDS,
    UNAVAILABLE_TOKEN,
    UNPROCESSABLE_REQUEST
  } = require('./errors');

  const {
    API_URL,
    TOKEN_ADDRESS,
    TOKEN_NAME,
    TOKEN_LOGO_URL,
    TOKEN_DENOMINATION
  } = process.env;

  /*
  Backend
  */

  identity.setURL(API_URL);
  fern.setURL(API_URL);

  const userApi = require('./api/api.user')();
  const userEvents = require('./events/events.user')();

  const peers = require('./peers');
  const { generateId } = require('./algorithms');

  const { StandardAgreement, ExchangeAgreement } = require('./contracts')({
    drv,
    userEvents
  });

  /*
  Private
  */

  const getTokenEmbrBalance = async ({ address, tokenAddress }) => {
    const transactionsResult = await userEvents.onServiceGet({
      service: drv,
      serviceName: 'drv',
      method: 'transactions'
    });

    if (!transactionsResult?.success) {
      return -1;
    }

    const transactions = transactionsResult.body;

    const tokenDebit = transactions
      .filter(block => (
        block.senderAddress === address &&
        block.tokenAddress === tokenAddress
      ))
      .map(({ drvAmount }) => drvAmount)
      .reduce((a, b) => a + b);

    const tokenCredit = transactions
      .filter(block => (
        block.recipientAddress === address &&
        block.tokenAddress === tokenAddress
      ))
      .map(({ drvAmount }) => drvAmount)
      .reduce((a, b) => a + b);

    return tokenCredit - tokenDebit;
  };

  /*
  Service (HTTP)
  */

  module.exports = http({
    GET: {
      price: async () => await userEvents.onServiceGet({
        service: drv,
        serviceName: 'drv',
        method: 'price'
      }),
      transactions: async () => await userEvents.onServiceGet({
        service: drv,
        serviceName: 'drv',
        method: 'transactions'
      }),
      info: () => ({
        address: TOKEN_ADDRESS,
        name: TOKEN_NAME,
        logo: TOKEN_LOGO_URL,
        denomination: TOKEN_DENOMINATION,
        peers
      })
    },
    POST: {
      auth: async ({
        username,
        password = false,
        token = ''
      }) => {
        if (!username) return;

        let result, userData;

        if (token) {
          result = await userApi.getUser({ token });

          if (!result?.username) {
            return INVALID_TOKEN_ERROR;
          }

          userData = result.userData || {};
        } else {
          result = await identity.create({
            username,
            password,
            appSlug: 'dereva'
          });

          if (!result?.token) {
            return SERVER_ERROR;
          }

          token = result.token;

          result = await identity.read({
            username,
            token
          });

          userData = (result.appData && result.appData['dereva']) || {}
        }

        const user = await userApi.createUser({
          token,
          id: username,
          username,
          userData
        });

        if (!user.userData?.address) {
          return UNPROCESSABLE_REQUEST;
        }

        const priceResult = await userEvents.onServiceGet({
          service: drv,
          serviceName: 'drv',
          method: 'price'
        });

        if (!priceResult || priceResult.status !== 200) {
          return SERVER_ERROR;
        }

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            token: user.token,
            isOnline: user.isOnline,
            userData: {
              address: user.userData.address
            }
          },
          price: priceResult.price,
          price24hAgo: priceResult.price24hAgo,
        };
      },
      register: async ({ username }) => {
        const signup = await identity.register({
          username,
          userData: {
            address: generateId()
          },
          appSlug: 'dereva'
        });

        if (!signup?.success) {
          return BAD_REQUEST;
        }

        return {
          success: true
        };
      },
      cards: fern.cards,
      transaction: async ({
        token,
        username,
        recipient,
        recipientAddress,
        tokenAddress,
        currency,
        usdAmount,
        drvAmount,
        cardNumber,
        contract
      }) => {
        if (!username || !token) return;

        const senderResult = await identity.read({ username, token });
        const recipientResult = await identity.read({ username: recipient, token });

        let senderResponse;

        if (senderResult?.username) {
          senderResponse = {
            username: senderResult.username,
            userData: senderResult.appData['dereva']
          };
        }

        let recipientResponse;

        if (recipientResult?.username) {
          recipientResponse = {
            username: recipientResult.username,
            userData: recipientResult.appData['dereva']
          };
        }

        if (!senderResponse?.username || !recipientResponse?.username) {
          return USER_NOT_FOUND_ERROR;
        }

        const currencySymbol = currency.toLowerCase();
        const isEmbr = currencySymbol === 'drv';

        if (isEmbr) {
          const senderTokenEmbrBalance = await getTokenEmbrBalance({
            address: senderResponse.userData.address,
            tokenAddress
          });

          if (senderTokenEmbrBalance < drvAmount) {
            return INSUFFICIENT_FUNDS;
          }

          senderAmount = drvAmount * -1;
          recipientAmount = drvAmount;
        } else {
          const recipientTokenEmbrBalance = await getTokenEmbrBalance({
            address: recipientAddress,
            tokenAddress
          });

          if (recipientTokenEmbrBalance < drvAmount) {
            return UNAVAILABLE_TOKEN;
          }

          const paymentResult = await fern.transaction({
            username: senderResponse.username,
            token,
            recipient: recipientResponse.username,
            usdAmount,
            cardNumber
          });

          if (!paymentResult?.success) {
            return SERVER_ERROR;
          }
        }

        const transactionResult = contract === 'exchange'
          ? await ExchangeAgreement({
            sender: senderResponse,
            recipientAddress,
            tokenAddress,
            drvAmount,
            currency
          })
          : await StandardAgreement({
            token,
            sender: senderResponse,
            recipient: recipientResponse,
            recipientAddress,
            tokenAddress,
            usdAmount,
            drvAmount,
            currency
          });

        if (!transactionResult) {
          return SERVER_ERROR;
        }

        user = await userApi.getUser({ token });

        console.log(
          `<Dereva> ${senderResponse.username} sent ${recipientResponse.username} ${isEmbr ? drvAmount.toFixed(2) : usdAmount.toFixed(2)} ${currency.toUpperCase()}.`
        );

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            token: user.token,
            isOnline: user.isOnline,
            userData: {
              address: user.userData.address
            }
          },
          price: transactionResult.price,
          price24hAgo: transactionResult.price24hAgo,
          marketCap: transactionResult.marketCap
        };
      }
    },
    PUT: {
      card: fern.save
    },
    DELETE: {}
  });
})();
