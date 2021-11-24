/*
 *
 * Service:Authorizations
 * (default)
 *
 */

(() => {

  /*
  Authorizations
  */

  const createTeller = require('./authorizations.balanceUpdate');

  /*
  Exports
  */

  module.exports = ({ userApi }) => ({
    BalanceUpdate: createTeller({ userApi })
  });
})();
