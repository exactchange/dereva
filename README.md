## Dereva

Dereva is a deployable digital currency that operates on the [Decentralized Record of Value](https://github.com/exactchange/drv-core) protocol. Any user with a minimum account balance of 0.0000000001 Dereva may define and alias (name) their new token to sell or freely distribute to their users in any amount and denomination they choose, limited to their account balance. Derevas are bound to, and can only be spent in whichever economy they were disbursed.

## Decentralization

Anyone can create their own token by forking the Dereva repository and serving it to the web with their new token name and configuration. The codebase installs a local copy of [drv-core](https://www.npmjs.com/package/drv-core), so that every instance of Dereva runs its own instance of the blockchain.

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
- `TOKEN_ADDRESS`, `TOKEN_NAME`, `TOKEN_LOGO_URL`, & `TOKEN_DENOMINATION`: Presumably, the reason you're forking this repo is to create your own Dereva. This is the token info your peer instance will broadcast to the network.

3. When your service is ready, deploy it to the web and begin selling your new token. Replenish your own token supply by purchasing [Dereva](https://exactchange.network/dereva/?app=shop).

## Topics

- [Decentralization](https://github.com/exactchange/drv-core/blob/master/README.md#decentralization)
- [Contracts](https://github.com/exactchange/drv-core/blob/master/README.md#contracts)
- [Validations](https://github.com/exactchange/drv-core/blob/master/README.md#validations)
- [Enforcements](https://github.com/exactchange/drv-core/blob/master/README.md#enforcements)
- [Redundancy](https://github.com/exactchange/drv-core/blob/master/README.md#redundancy)
- [Trading](https://github.com/exactchange/drv-core/blob/master/README.md#trading)
- [Anonymous Tokens](https://github.com/exactchange/drv-core/blob/master/README.md#anonymous-tokens)
