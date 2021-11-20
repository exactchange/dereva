/*
 * Native Ember Token
 */

require('dotenv').config();

const { PORT, HOST } = process.env;

if (!HOST || !PORT) {
  console.log('Please create a local .env file! Exiting.');
  process.exit();
}

// Configure HTTP

const express = require('express');
const cors = require('cors');

const Server = express();

Server.use(express.json());
Server.use(express.urlencoded({ extended: false }));
Server.use(cors());

const server = require('http').createServer(Server);

server.listen(PORT, () => {
  console.log(`Native Ember Token is online at ${HOST}.`);

  // Native Ember Token service

  const net = require('./src');

  // Handle ping

  Server.get('/', (_, res) => (
    res.send('Native Ember Token service is running.'))
  );

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
