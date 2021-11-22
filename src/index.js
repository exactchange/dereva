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

  const {
    API_KEY,
    TOKEN_ADDRESS,
    TOKEN_NAME,
    TOKEN_LOGO_URL,
    TOKEN_DENOMINATION
  } = process.env;

  const {
    create,
    read,
    update,
    register
  } = require('identity-client');

  const {
    SERVER_ERROR,
    BAD_REQUEST,
    INVALID_TOKEN_ERROR,
    USER_NOT_FOUND_ERROR,
    INSUFFICIENT_FUNDS,
    UNAVAILABLE_TOKEN
  } = require('./errors');

  /*
  Backend
  */

  const userApi = require('./api/api.user')();
  const userEvents = require('./events/events.user')();

  const { generateId } = require('./algorithms');

  /*
  Private
  */

  const updateUserBalance = async ({ token, user, field, amount }) => {
    const userData = {
      ...user.userData,

      [field]: parseFloat(user.userData[field] + amount),
    };

    const updateResult = await update({
      username: user.username,
      token,
      appSlug: 'native-ember-token',
      apiKey: API_KEY,
      payload: {
        [field]: userData[field]
      }
    });

    if (!updateResult?.success) {
      return false;
    }

    const apiUpdateResult = await userApi.updateUser({
      token,
      userData
    });

    if (!apiUpdateResult) {
      return false;
    }

    return true;
  };

  const processTransaction = async ({
    token,
    sender,
    senderAmount,
    recipient,
    recipientAddress,
    recipientAmount,
    tokenAddress,
    usdAmount,
    embrAmount,
    currency,
    denomination
  }) => {
    const currencySymbol = currency.toLowerCase();
    const isEmbr = currencySymbol === 'embr';
    const field = isEmbr ? 'embrBalance' : 'usdBalance';

    const transactionResult = await userEvents.onServicePost({
      service: embercoin,
      serviceName: 'embercoin',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress,
        tokenAddress,
        usdAmount,
        embrAmount,
        currency,
        denomination
      }
    });

    if (!transactionResult || transactionResult.status !== 200) {
      return false;
    }

    const senderUpdate = await updateUserBalance({
      token,
      user: sender,
      field,
      amount: senderAmount
    });

    if (!senderUpdate) {
      return false;
    }

    const recipientUpdate = await updateUserBalance({
      token,
      user: recipient,
      field,
      amount: parseFloat(
        recipientAmount + (
          isEmbr
            ? parseFloat(transactionResult.reward || 0)
            : 0
        )
      )
    });

    if (!recipientUpdate) {
      return false;
    }

    if (!isEmbr) {
      const transferResult = await processTransaction({
        token,
        sender: recipient,
        senderAmount: embrAmount * -1,
        recipient: sender,
        recipientAddress: sender.userData.address,
        recipientAmount: embrAmount,
        tokenAddress,
        usdAmount: transactionResult.price * embrAmount,
        embrAmount,
        currency: 'embr',
        denomination
      });

      if (!transferResult) {
        console.log(
          '<Native Ember Token> Transfer Error: There was a problem transferring EMBR between accounts.', sender, recipient
        );
      }
    }

    return transactionResult;
  };

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
          result = await create({
            username,
            password,
            appSlug: 'native-ember-token'
          });

          if (!result?.token) {
            return INVALID_TOKEN_ERROR;
          }

          token = result.token;

          result = await read({
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
        const signup = await register({
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
      transaction: async ({
        token,
        username,
        recipient,
        recipientAddress,
        tokenAddress,
        currency,
        usdAmount,
        embrAmount,
        cardNumber
      }) => {
        if (!username || !token) return;

        const senderResult = await read({ username, token });
        const recipientResult = await read({ username: recipient, token });

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
            console.log(
              '/transaction',
              '****PROCESS PAYMENTS HERE****',
              cardNumber,
              {
                amount: usdAmount
              }
            );

            senderAmount = 0;
          } else {
            senderAmount = usdAmount * -1;
          }

          recipientAmount = usdAmount;
        }

        const transactionResult = await processTransaction({
          token,
          sender: senderResponse,
          senderAmount,
          recipient: recipientResponse,
          recipientAddress,
          recipientAmount,
          tokenAddress,
          usdAmount,
          embrAmount,
          currency,
          denomination: TOKEN_DENOMINATION
        });

        if (!transactionResult) {
          return SERVER_ERROR;
        }

        user = await userApi.getUser({ token });

        console.log(
          `<Native Ember Token> ${senderResponse.username} sent ${recipientResponse.username} ${isCoin ? embrAmount.toFixed(2) : usdAmount.toFixed(2)} ${currency.toUpperCase()}.`
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
    PUT: {},
    DELETE: {}
  });
})();
