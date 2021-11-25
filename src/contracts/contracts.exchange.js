/*
 *
 * Service:Contracts
 * ExchangeAgreement
 *
 */

module.exports = ({ embercoin, userEvents }) => (
  async ({
    sender,
    recipientAddress,
    tokenAddress,
    embrAmount,
    currency
  }) => {
    const currencySymbol = currency.toLowerCase();
    const isEmbr = currencySymbol === 'embr';

    if (!isEmbr || sender.userData.address !== recipientAddress) {
      return false;
    }

    const transactionResult = await userEvents.onServicePost({
      service: embercoin,
      serviceName: 'embercoin',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress: 'treasury-0000-0000-0000-000000000000',
        tokenAddress,
        usdAmount: 0,
        embrAmount,
        currency: 'embr'
      }
    });

    if (!transactionResult || transactionResult.status !== 200) {
      return false;
    }

    const exchangeResult = await userEvents.onServicePost({
      service: embercoin,
      serviceName: 'embercoin',
      method: 'transaction',
      body: {
        senderAddress: 'treasury-0000-0000-0000-000000000000',
        recipientAddress: sender.userData.address,
        tokenAddress: sender.userData.address,
        usdAmount: 0,
        embrAmount,
        currency: 'embr'
      }
    });

    if (!exchangeResult || exchangeResult.status !== 200) {
      return false;
    }

    return exchangeResult;
  }
);
