/*
 *
 * Service:Contracts
 * Non-Fungible Record
 *
 */

module.exports = ({ drv, peers, userEvents }) => {
  const Record = require('./contracts.record')({ drv, peers, userEvents });

  const NonFungibleRecord = async ({
    token,
    sender,
    recipient,
    recipientAddress,
    contract = 'nonFungibleRecord',
    usdValue,
    drvValue,
    isDrv
  }) => Record({
    token,
    sender,
    recipient,
    recipientAddress,
    contract,
    usdValue,
    drvValue,
    isDrv
  });

  return NonFungibleRecord;
};
