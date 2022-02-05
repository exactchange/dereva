/*
 *
 * Service:Contracts
 * (default)
 *
 */

(() => {

  /*
  Exports
  */

  module.exports = ({ drv, userEvents }) => ({
    Record: require('./contracts.record')({ drv, userEvents })
  });
})();
