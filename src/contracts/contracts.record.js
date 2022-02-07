/*
 *
 * Service:Contracts
 * Record
 *
 */

module.exports = ({ drv, peers, userEvents }) => {
  const Record = async ({
    token,
    sender,
    recipient,
    recipientAddress,
    contract,
    usdValue,
    drvValue,
    isDrv
  }) => {
    if (isDrv) {
      const transactionResult = await userEvents.onServicePost({
        service: drv,
        serviceName: '/',
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

      return transactionResult;
    }

    const priceResult = await userEvents.onServiceGet({
      service: drv,
      serviceName: '/',
      method: 'price'
    });

    if (!priceResult || priceResult.status !== 200) {
      return false;
    }

    const transferResult = await Record({
      token,
      sender: recipient,
      recipient: sender,
      recipientAddress: sender.userData.address,
      contract: 'record',
      usdValue,
      drvValue,
      isDrv: true
    });

    if (!transferResult) {
      console.log(
        '<Dereva> Transfer Error: There was a problem transferring DRV between accounts.', sender, recipient
      );
    }

    return transferResult;
  };

  return Record;
};
