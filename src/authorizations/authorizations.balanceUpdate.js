/*
 *
 * Service:Authorizations
 * BalanceUpdate
 *
 */

(() => {
  /*
  Dependencies
  */

  const { API_KEY } = process.env;
  const { update } = require('identity-client');

  module.exports = ({ userApi }) => (
    async ({ token, user, field, amount }) => {
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
    }
  );
})();