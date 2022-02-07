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
    Record: require('./contracts.record')({ drv, peers, userEvents }),
    NonFungibleRecord: require('./contracts.nonFungibleRecord')({ drv, peers, userEvents })
  });
})();
