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

  fern.setURL(API_URL);

  const userApi = require('./api/api.user')();
  const userEvents = require('./events/events.user')();
  const peers = require('./peers');
  const { generateId } = require('./algorithms');

  const { Record } = require('./contracts')({
    drv,
    peers,
    userEvents
  });

  /*
  Private
  */

  const getDrvTokenBalance = async ({ address }) => {
    const transactionsResult = await userEvents.onServiceGet({
      service: drv,
      serviceName: 'dereva',
      method: 'transactions'
    });

    if (!transactionsResult?.success) {
      return -1;
    }

    const transactions = transactionsResult.body;

    let tokenDebit = transactions
      .filter(block => (
        typeof(block.drvValue) === 'number' &&
        block.senderAddress === address
      ))
      .map(({ drvValue }) => drvValue * TOKEN_DENOMINATION);

    if (tokenDebit?.length > 1) {
      tokenDebit = tokenDebit.reduce((a, b) => a + b);
    }

    let tokenCredit = transactions
      .filter(block => (
        typeof(block.drvValue) === 'number' &&
        block.recipientAddress === address
      ))
      .map(({ drvValue }) => drvValue * TOKEN_DENOMINATION);

    if (tokenCredit?.length > 1) {
      tokenCredit = tokenCredit.reduce((a, b) => a + b);
    }

    return tokenCredit - tokenDebit;
  };

  /*
  Service (HTTP)
  */

  module.exports = http({
    GET: {
      price: async () => await userEvents.onServiceGet({
        service: drv,
        serviceName: 'dereva',
        method: 'price'
      }),
      transactions: async () => await userEvents.onServiceGet({
        service: drv,
        serviceName: 'dereva',
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
        usdValue,
        drvValue,
        cardNumber,
        contract = 'record'
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

        const isDrv = !cardNumber;
        const isFungible = contract === 'record';

        if (isDrv) {
          if (isFungible) {
            const senderTokenDrvBalance = await getDrvTokenBalance({
              address: senderResponse.userData.address
            });

            if (senderTokenDrvBalance < drvValue) {
              return INSUFFICIENT_FUNDS;
            }
          }


        } else {
          if (isFungible) {
            const recipientTokenDrvBalance = await getDrvTokenBalance({
              address: recipientAddress
            });

            if (recipientTokenDrvBalance < drvValue) {
              return UNAVAILABLE_TOKEN;
            }
          }

          const paymentResult = await fern.transaction({
            username: senderResponse.username,
            token,
            recipient: recipientResponse.username,
            usdValue,
            cardNumber
          });

          if (!paymentResult?.success) {
            return SERVER_ERROR;
          }
        }

        const transactionResult = await Record({
          token,
          sender: senderResponse,
          recipient: recipientResponse,
          recipientAddress,
          contract,
          usdValue,
          drvValue,
          isDrv
        });

        if (!transactionResult) {
          return SERVER_ERROR;
        }

        user = await userApi.getUser({ token });

        if (isFungible) {
          console.log(
            `<Dereva> ${senderResponse.username} sent ${recipientResponse.username} ${isDrv ? `${drvValue.toFixed(2)} DRV` : `${usdValue.toFixed(2)} USD`}.`
          );
        } else {
          console.log(
            `<Dereva> ${senderResponse.username} transferred a record to ${senderResponse.username === recipientResponse.username ? 'the blockchain' : recipientResponse.username}.`
          );
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
