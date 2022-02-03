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

  module.exports = ({ drv, userEvents }) => ({
    StandardAgreement: createStandardAttorney({ drv, userEvents }),
    ExchangeAgreement: createExchangeAttorney({ drv, userEvents })
  });
})();
