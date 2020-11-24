'use strict';
const getHandler = require('./get-handler');
const postHandler = require('./post-handler');
const util = require('./handler-util');

function route(req, res) {
  switch (req.method) {
    case 'GET':
      getHandler.handle(req, res);
      break;
    case 'POST':
      postHandler.handle(req, res);
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = {
  route
};