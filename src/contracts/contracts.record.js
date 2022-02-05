/*
 *
 * Service:Contracts
 * Record
 *
 */

const peers = require('../peers');

module.exports = ({ drv, userEvents }) => {
  const Record = async ({
    token,
    sender,
    recipient,
    recipientAddress,
    usdValue,
    drvValue,
    isDrv
  }) => {
    const isFungible = contract === 'record';

    const transactionResult = await userEvents.onServicePost({
      service: drv,
      serviceName: 'drv',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress,
        contract,
        usdValue,
        drvValue,
        peers: Object.values(peers)
      }
    });

    if (!transactionResult || transactionResult.status !== 200) {
      return false;
    }

    if (!isDrv) {
      const transferResult = await Record({
        token,
        sender: recipient,
        recipient: sender,
        recipientAddress: sender.userData.address,
        usdValue: (isFungible ? (transactionResult.price * drvValue) : usdValue),
        drvValue
      });

      if (!transferResult) {
        console.log(
          '<Dereva> Transfer Error: There was a problem transferring DRV between accounts.', sender, recipient
        );
      }
    }

    return transactionResult;
  };

  return Record;
};
