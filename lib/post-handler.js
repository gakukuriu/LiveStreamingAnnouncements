'use strict';
const lv = require('./lives-util');
const util = require('./handler-util');

function handle(req, res) {
  let rawData = '';
  req.on('data', chunk => {
    rawData = rawData + chunk;
  }).on('end', () => {
    const qs = require('querystring');
    const answer = qs.parse(rawData);
    lv.add(answer['title'], answer['time'], answer['description'], ('/lives/' + util.randomAddressGenerator()));
    console.info(answer['title']);
    console.info(answer['time']);
    console.info(answer['description']);
    res.writeHead(302, { Location: "/" });
    res.end();
  });
}

module.exports = {
  handle
};