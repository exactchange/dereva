/*
 *
 * Service:Contracts
 * (default)
 *
 */

(() => {

  /*
  Contracts
  */

  const createStandardAttorney = require('./contracts.standard');
  const createExchangeAttorney = require('./contracts.exchange');

  /*
  Exports
  */

  module.exports = ({ embercoin, userEvents, BalanceUpdate }) => ({
    StandardAgreement: createStandardAttorney({ embercoin, userEvents, BalanceUpdate }),
    ExchangeAgreement: createExchangeAttorney({ embercoin, userEvents })
  });
})();
