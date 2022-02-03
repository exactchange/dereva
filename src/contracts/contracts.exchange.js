/*
 *
 * Service:Contracts
 * ExchangeAgreement
 *
 */

const peers = require('../peers');

module.exports = ({ drv, userEvents }) => (
  async ({
    sender,
    recipientAddress,
    tokenAddress,
    drvAmount,
    currency
  }) => {
    const currencySymbol = currency.toLowerCase();
    const isEmbr = currencySymbol === 'drv';

    if (!isEmbr || sender.userData.address !== recipientAddress) {
      return false;
    }

    const transactionResult = await userEvents.onServicePost({
      service: drv,
      serviceName: 'drv',
      method: 'transaction',
      body: {
        senderAddress: sender.userData.address,
        recipientAddress: 'treasury-0000-0000-0000-000000000000',
        tokenAddress,
        usdAmount: 0,
        drvAmount,
        currency: 'drv',
        peers: Object.values(peers)
      }
    });

    if (!transactionResult || transactionResult.status !== 200) {
      return false;
    }

    const exchangeResult = await userEvents.onServicePost({
      service: drv,
      serviceName: 'drv',
      method: 'transaction',
      body: {
        senderAddress: 'treasury-0000-0000-0000-000000000000',
        recipientAddress: sender.userData.address,
        tokenAddress: sender.userData.address,
        usdAmount: 0,
        drvAmount,
        currency: 'drv',
        peers: Object.values(peers)
      }
    });

    if (!exchangeResult || exchangeResult.status !== 200) {
      return false;
    }

    return exchangeResult;
  }
);
