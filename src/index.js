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
  const embercoin = require('embercoin');

  const identity = require('identity-client');
  const fern = require('fern-client');

  const {
    SERVER_ERROR,
    BAD_REQUEST,
    INVALID_TOKEN_ERROR,
    USER_NOT_FOUND_ERROR,
    INSUFFICIENT_FUNDS,
    UNAVAILABLE_TOKEN
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

  const { generateId } = require('./algorithms');

  const { BalanceUpdate } = require('./authorizations')({ userApi });
  const { StandardAgreement, ExchangeAgreement } = require('./contracts')({ embercoin, userEvents, BalanceUpdate });

  /*
  Service (HTTP)
  */

  module.exports = http({
    GET: {
      price: async () => await userEvents.onServiceGet({
        service: embercoin,
        serviceName: 'embercoin',
        method: 'price'
      }),
      transactions: async () => await userEvents.onServiceGet({
        service: embercoin,
        serviceName: 'embercoin',
        method: 'transactions'
      }),
      info: () => ({
        address: TOKEN_ADDRESS,
        name: TOKEN_NAME,
        logo: TOKEN_LOGO_URL,
        denomination: TOKEN_DENOMINATION
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
            return USER_NOT_FOUND_ERROR;
          }

          userData = result.userData || {};
        } else {
          result = await identity.create({
            username,
            password,
            appSlug: 'native-ember-token'
          });

          if (!result?.token) {
            return INVALID_TOKEN_ERROR;
          }

          token = result.token;

          result = await identity.read({
            username,
            token
          });

          userData = (result.appData && result.appData['native-ember-token']) || {}
        }

        const user = await userApi.createUser({
          token,
          id: username,
          username,
          userData
        });

        if (!user.userData?.tokens) {
          return USER_NOT_FOUND_ERROR;
        }

        const priceResult = await userEvents.onServiceGet({
          service: embercoin,
          serviceName: 'embercoin',
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
              address: user.userData.address,
              tokens: user.userData.tokens,
              usdBalance: user.userData.usdBalance,
              embrBalance: user.userData.embrBalance
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
            tokens: [],
            embrBalance: 0,
            usdBalance: 0,
            address: generateId()
          },
          appSlug: 'native-ember-token'
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
        embrAmount,
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
            userData: senderResult.appData['native-ember-token']
          };
        }

        let recipientResponse;

        if (recipientResult?.username) {
          recipientResponse = {
            username: recipientResult.username,
            userData: recipientResult.appData['native-ember-token']
          };
        }

        if (!senderResponse?.username || !recipientResponse?.username) {
          return USER_NOT_FOUND_ERROR;
        }

        const currencySymbol = currency.toLowerCase();
        const isEmbr = currencySymbol === 'embr';

        if (isEmbr) {
          if (senderResponse.userData.embrBalance < embrAmount) {
            return INSUFFICIENT_FUNDS;
          }

          senderAmount = embrAmount * -1;
          recipientAmount = embrAmount;
        } else {
          if (recipientResponse.userData.embrBalance < embrAmount) {
            return UNAVAILABLE_TOKEN;
          }

          if (senderResponse.userData.usdBalance < (usdAmount + 1)) {
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

            senderAmount = 0;
          } else {
            senderAmount = usdAmount * -1;
          }

          recipientAmount = usdAmount;
        }

        const transactionResult = contract === 'exchange'
          ? await ExchangeAgreement({
            sender: senderResponse,
            recipientAddress,
            tokenAddress,
            embrAmount,
            currency
          })
          : await StandardAgreement({
            token,
            sender: senderResponse,
            senderAmount,
            recipient: recipientResponse,
            recipientAddress,
            recipientAmount,
            tokenAddress,
            usdAmount,
            embrAmount,
            currency
          });

        if (!transactionResult) {
          return SERVER_ERROR;
        }

        user = await userApi.getUser({ token });

        console.log(
          `<Native Ember Token> ${senderResponse.username} sent ${recipientResponse.username} ${isEmbr ? embrAmount.toFixed(2) : usdAmount.toFixed(2)} ${currency.toUpperCase()}.`
        );

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            token: user.token,
            isOnline: user.isOnline,
            userData: {
              address: user.userData.address,
              tokens: user.userData.tokens,
              usdBalance: user.userData.usdBalance,
              embrBalance: user.userData.embrBalance
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
