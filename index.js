'use strict';
const http = require('http');
const { runInNewContext } = require('vm');
const router = require('./lib/router');

const server = http.createServer((req, res) => {
  console.info('Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  router.route(req, res);  
})
.on('error', e => {
  console.error('Server Error', e);
})
.on('clientError', e => {
  console.error('Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('Listening on ' + port);
});