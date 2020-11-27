'use strict';
const lv = require('./lives-util');
const util = require('./handler-util');
const md = require('markdown-it')();

function handle(req, res) {
  let rawData = '';
  req.on('data', chunk => {
    rawData = rawData + chunk;
  }).on('end', () => {
    const qs = require('querystring');
    const answer = qs.parse(rawData);
    const descriptionHtml = md.render(answer['description']);
    lv.add(answer['title'], answer['time'], descriptionHtml, ('/lives/' + util.randomAddressGenerator()));
    console.info(answer['title']);
    console.info(answer['time']);
    console.info(answer['description']);
    res.writeHead(301, { Location: "/" });
    res.end();
  });
}

module.exports = {
  handle
};