## Native Ember Token

### Usage

1. Fork this repo and make any desired changes or necessary extensions, for example, allow it to serve a front-end, or connect it to another service.

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
