/*
 *
 * Service:Contracts
 * StandardAgreement
 *
 */

module.exports = ({ embercoin, userEvents }) => {
  const StandardAgreement = async ({
    token,
    sender,
    recipient,
    recipientAddress,
    tokenAddress,
    usdAmount,
    embrAmount,
    currency
  }) => {
    const currencySymbol = currency.toLowerCase();
    const isEmbr = currencySymbol === 'embr';

    const transactionResult = await userEvents.onServicePost({
      service: embercoin,
      serviceName: 'embercoin',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress,
        tokenAddress,
        usdAmount,
        embrAmount,
        currency
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
        usdAmount: transactionResult.price * embrAmount,
        embrAmount,
        currency: 'embr'
      });

      if (!transferResult) {
        console.log(
          '<Native Ember Token> Transfer Error: There was a problem transferring EMBR between accounts.', sender, recipient
        );
      }
    }

    return transactionResult;
  };

  return StandardAgreement;
};
