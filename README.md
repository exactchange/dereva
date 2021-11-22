## Native Ember Token (NET)

### What is NET?

NET is a deployable digital currency that operates on Embercoin via the EMBR protocol. Any user with a minimum account balance of 1 EMBR may define and alias (name) their own token to sell or freely distribute to their users in any amount and denomination they choose, limited to their account balance. Token denomination itself is untracked and unregulated in order to extend price flexibility to the token merchant. A blockchain transaction occurs only when tokens are transferred between users, at which time a normal Embercoin transaction is carried out at the EMBR value at which it was disbursed, accounting for how it was denominated.

NETs are bound to, and can only be spent in whichever economy they were disbursed. In addition to spending them, assuming a minimum account value of 1 EMBR, they can be liquidated, or converted back into EMBR in order to be traded or disbursed in a new, private economy to which their native status will be migrated.

### Decentralization

Anyone can create their own token by forking this repository and serving it to the web with their new token name and configuration. The codebase installs a local copy of Embercoin, so that every instance of Native Ember Token runs its own instance of the Embercoin blockchain.

Whenever a merchant sells a token, the transaction is broadcasted to other token merchants in the peer network, who run their own Embercoin transaction validation logic to determine if the transaction should be entered into their blockchain instance. Because everyone installs the same Embercoin blockchain, the validation logic should be identical if a token merchant does not tamper with the code. If they do tamper with it, they may yield different validation results than other nodes.

Any user can thus determine the validity of a transaction by checking at any time how many instances of Embercoin validated it against how many instances are running: For example if 100 instances of Embercoin are live in the network, if 99 of those instances are not able to validate an incoming transaction based on what was submitted by the merchant, but 1 instance which has been tampered with does validate it, the transaction enters only that 1 fraudulent blockchain instance and is rejected by the other 99. When any user wants to verify that a transaction is valid, they only need to check with a number of peers at random to build confidence in the validity. As more peers corroborate the transaction, confidence is built, and upon a certain threshold determined by the user a transaction can be deemed valid.

When performing a basic balance inquiry or when transferring EMBR to another user, like any other request to Embercoin the values are determined functionally - that is, they are calculated at the time it's needed to be across a number of peer instances until the provided confidence threshold is met.

Buyers and sellers may reserve a right to only agree to transactions of a certain level of confidence, and are encouraged to deal in only high-confidence transactions. In scenarios where a lot of capital is at stake, extended closing periods may become the norm where a target confidence level must be retained for a period of time before the token sale is finalized, at the discretion of the parties involved.

### Usage

1. Fork this repository and make any desired changes or necessary extensions. For example, set it up to serve a front-end, or connect it to another service.

2. Add an `.env` file to the root of your directory with the following scaffold:


```
  API_KEY=
  BLOCKCHAIN_DB_NAME=
  BLOCKCHAIN_MONGO_URI=
  HOST=
  PORT=
  TOKEN_ADDRESS=
  TOKEN_NAME=
  TOKEN_LOGO_URL=
  TOKEN_DENOMINATION=
```

- `API_KEY`: Only required if you plan on using the built-in [Person](https://github.com/exactchange/person) identity management platform.
- `BLOCKCHAIN_DB_NAME` & `BLOCKCHAIN_MONGO_URI`: Your MongoDB Atlas Database name and URI.
- `HOST`: The address at which you host this app.
- `PORT`: The port you're serving it over.
- `TOKEN_ADDRESS`, `TOKEN_NAME`, `TOKEN_LOGO_URL`, & `TOKEN_DENOMINATION`: Presumably, the reason you're forking this repo is to create your own Native Ember Token. This is the token info your peer instance will broadcast to the network.

3. When your service is ready, deploy it to the web and begin selling your new token. Replenish your own token supply by purchasing & liquidating [Ember](https://exactchange.herokuapp.com/ember/?app=shop).
