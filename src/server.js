'use strict';

require('dotenv').config();

const http = require('http');

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
