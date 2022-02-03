/*
 *
 * Service:Contracts
 * StandardAgreement
 *
 */

const peers = require('../peers');

module.exports = ({ drv, userEvents }) => {
  const StandardAgreement = async ({
    token,
    sender,
    recipient,
    recipientAddress,
    tokenAddress,
    usdAmount,
    drvAmount,
    currency
  }) => {
    const currencySymbol = currency.toLowerCase();
    const isEmbr = currencySymbol === 'drv';

    const transactionResult = await userEvents.onServicePost({
      service: drv,
      serviceName: 'drv',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress,
        tokenAddress,
        usdAmount,
        drvAmount,
        currency,
        peers: Object.values(peers)
      }
    });

    if (!transactionResult || transactionResult.status !== 200) {
      return false;
    }

    if (!isEmbr) {
      const transferResult = await StandardAgreement({
        token,
        sender: recipient,
        recipient: sender,
        recipientAddress: sender.userData.address,
        tokenAddress,
        usdAmount: transactionResult.price * drvAmount,
        drvAmount,
        currency: 'drv'
      });

      if (!transferResult) {
        console.log(
          '<Dereva> Transfer Error: There was a problem transferring DRV between accounts.', sender, recipient
        );
      }
    }

    return transactionResult;
  };

  return StandardAgreement;
};
