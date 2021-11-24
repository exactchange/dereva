/*
 *
 * Service:Contracts
 * StandardAgreement
 *
 */

(() => {

  /*
  Dependencies
  */

  module.exports = ({ embercoin, userEvents, BalanceUpdate }) => (
    async ({
      token,
      sender,
      senderAmount,
      recipient,
      recipientAddress,
      recipientAmount,
      tokenAddress,
      usdAmount,
      embrAmount,
      currency,
      denomination
    }) => {
      const currencySymbol = currency.toLowerCase();
      const isEmbr = currencySymbol === 'embr';
      const field = isEmbr ? 'embrBalance' : 'usdBalance';

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
          currency,
          denomination
        }
      });

      if (!transactionResult || transactionResult.status !== 200) {
        return false;
      }

      const senderUpdate = await BalanceUpdate({
        token,
        user: sender,
        field,
        amount: senderAmount
      });

      if (!senderUpdate) {
        return false;
      }

      const recipientUpdate = await BalanceUpdate({
        token,
        user: recipient,
        field,
        amount: parseFloat(
          recipientAmount + (
            isEmbr
              ? parseFloat(transactionResult.reward || 0)
              : 0
          )
        )
      });

      if (!recipientUpdate) {
        return false;
      }

      if (!isEmbr) {
        const transferResult = await StandardAgreement({
          token,
          sender: recipient,
          senderAmount: embrAmount * -1,
          recipient: sender,
          recipientAddress: sender.userData.address,
          recipientAmount: embrAmount,
          tokenAddress,
          usdAmount: transactionResult.price * embrAmount,
          embrAmount,
          currency: 'embr',
          denomination
        });

        if (!transferResult) {
          console.log(
            '<Native Ember Token> Transfer Error: There was a problem transferring EMBR between accounts.', sender, recipient
          );
        }
      }

      return transactionResult;
    }
  );
})();
