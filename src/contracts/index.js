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

  module.exports = ({ embercoin, userEvents }) => ({
    StandardAgreement: createStandardAttorney({ embercoin, userEvents }),
    ExchangeAgreement: createExchangeAttorney({ embercoin, userEvents })
  });
})();
