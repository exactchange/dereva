## Native Ember Token (NET)

Native Ember Token is a deployable digital currency that operates on [Embercoin](https://github.com/exactchange/embercoin) via the EMBR protocol. Any user with a minimum account balance of 0.0000000001 EMBR may define and alias (name) their new token to sell or freely distribute to their users in any amount and denomination they choose, limited to their account balance. Token denomination itself is untracked and unregulated in order to extend price flexibility to the token merchant. A blockchain transaction occurs only when tokens are transferred between users.

Native Ember Tokens are bound to, and can only be spent in whichever economy they were disbursed. In addition to spending NETs, assuming a minimum account value of 0.0000000001 EMBR, they can be liquidated, or converted back into EMBR in order to be traded or disbursed in a new, private economy to which their native status will be migrated. Therefore, decentralized exchange (or DEX) is a built-in feature the token system, and runs a special validation case in the blockchain where tokens are shuffled through an arbitrary third party in order to yield the desired exchange.

## Decentralization

Anyone can create their own token by forking the Native Ember Token repository and serving it to the web with their new token name and configuration. The codebase installs a local copy of [Embercoin](https://www.npmjs.com/package/embercoin), so that every instance of Native Ember Token runs its own instance of the Embercoin blockchain.

## Usage

1. Fork this repository and make any desired changes or necessary extensions. For example, change the way the front-end looks and behaves, or connect it to another backend service, etc.

2. Add an `.env` file to the root of your directory with the following scaffold:


```
  API_KEY=
  API_URL=
  BLOCKCHAIN_DB_NAME=
  BLOCKCHAIN_MONGO_URI=
  HOST=
  PORT=
  TOKEN_ADDRESS=
  TOKEN_NAME=
  TOKEN_LOGO_URL=
  TOKEN_DENOMINATION=
```

- `API_KEY` & `API_URL`: Only required if you plan on using the built-in [Identity Client](https://github.com/exactchange/identity-client).
- `BLOCKCHAIN_DB_NAME` & `BLOCKCHAIN_MONGO_URI`: Your MongoDB Atlas Database name and URI.
- `HOST`: The address at which you host this app.
- `PORT`: The port you're serving it over.
- `TOKEN_ADDRESS`, `TOKEN_NAME`, `TOKEN_LOGO_URL`, & `TOKEN_DENOMINATION`: Presumably, the reason you're forking this repo is to create your own Native Ember Token. This is the token info your peer instance will broadcast to the network.

3. When your service is ready, deploy it to the web and begin selling your new token. Replenish your own token supply by purchasing & liquidating [Ember](https://exactchange.network/ember/?app=shop).

## Topics

- [Decentralizing EMBR](https://github.com/exactchange/embercoin/blob/master/README.md#decentralization)
- [Contracts](https://github.com/exactchange/embercoin/blob/master/README.md#contracts)
- [Validations](https://github.com/exactchange/embercoin/blob/master/README.md#validations)
- [Enforcements](https://github.com/exactchange/embercoin/blob/master/README.md#enforcements)
- [Consensus Tax](https://github.com/exactchange/embercoin/blob/master/README.md#consensus-tax)
- [Limited Trust Networks](https://github.com/exactchange/embercoin/blob/master/README.md#peer-lists--limited-trust-networks)
- [Trading](https://github.com/exactchange/embercoin/blob/master/README.md#trading)
- [Anonymous Tokens](https://github.com/exactchange/embercoin/blob/master/README.md#anonymous-tokens)
