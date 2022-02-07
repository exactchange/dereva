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

  module.exports = ({ drv, peers, userEvents }) => ({
    Record: require('./contracts.record')({ drv, peers, userEvents })
  });
})();
