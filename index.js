require('dotenv').config();

/*
 * Native Ember Token
 */

[
  'API_KEY',
  'API_URL',
  'BLOCKCHAIN_DB_NAME',
  'BLOCKCHAIN_MONGO_URI',
  'HOST',
  'PORT',
  'TOKEN_ADDRESS',
  'TOKEN_NAME',
  'TOKEN_LOGO_URL',
  'TOKEN_DENOMINATION'
].forEach(config => {
  if (!(config in process.env)) {
    console.log(`${config} is missing from your .env file! Exiting.`);
    process.exit();
  }
});

const { PORT, HOST } = process.env;

// Configure HTTP

const express = require('express');
const cors = require('cors');
const path = require('path');

const Server = express();

Server.use(express.json());
Server.use(express.urlencoded({ extended: false }));
Server.use(cors());

Server.use(
  express.static(
    path.join(__dirname, 'public', '/')
  )
);

const server = require('http').createServer(Server);

server.listen(PORT, async () => {
  console.log(`Native Ember Token is online at ${HOST}.`);

  // Native Ember Token service

  const net = require('./src');

  // Handle http

  Server.get('/*', (req, res) => {
    if (Object.keys(req.query).length) {
      return net.onHttpSearch(req, res);
    }

    return net.onHttpGet(req, res);
  });

  Server.post('/*', (req, res) => (
    net.onHttpPost(req, res)
  ));

  Server.put('/*', (req, res) => (
    net.onHttpPut(req, res)
  ));

  Server.delete('/*', (req, res) => (
    net.onHttpDelete(req, res)
  ));
});
