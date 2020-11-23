'use strict';
const http = require('http');
const pug = require('pug');
const fs = require('fs');
const { runInNewContext } = require('vm');
const fileName = './lives.json';

const data = fs.readFileSync(fileName, 'utf8');
let lives = JSON.parse(data);

function saveLives() {
  fs.writeFileSync(fileName, JSON.stringify(lives), 'utf8');
}

function sortLives(lives) {
  lives.sort((x, y) => x.time - y.time);
}

function liveAddress(lives) {
  let liveadd = [];
  lives.forEach(element => {
    liveadd.push('/lives/' + element.address)
  });
  return liveadd;
}

function add(tt, tm, desc, addr) {
  lives.push({title: tt, time: tm, description: desc, address: addr});
  sortLives(lives);
  saveLives();
}

function del(tt, tm, desc, addr) {
  const indexFound = lives.findIndex(l => (l.title === tt) && (l.time === tm) && (l.description === desc) && (l.address === addr));
  if (indexFound !== -1) {
    lives.splice(indexFound, 1);
    saveLives();
  }
}

function randomAddressGenerator() {
  var l = 8;
  var c = "abcdefghijklmnopqrstuvwxyz0123456789";

  var cl = c.length;
  var r = "";
  for(var i=0; i<l; i++){
    r += c[Math.floor(Math.random()*cl)];
  }
  return r;
}

const server = http.createServer((req, res) => {
  console.info('Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      let liveAdds = liveAddress(lives);
      if (req.url === '/') {
        let currentLives = '<ul>';
        let nextLives = '<ul>';
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        lives.forEach(element => {
          var liveTime = new Date(element.time);
          if (now < liveTime.getTime()) {
            nextLives = nextLives + '<li>' + 
            '<a href="/lives/' + element.address + '">' +
            element.title + ' (' + element.time + '~' + ')' + '</a>' + '</li>'
          } else if (now < (liveTime.getTime() + oneHour)) {
            currentLives = currentLives + '<li>' + 
            '<a href="/lives/' + element.address + '">' +
            element.title + ' (' + element.time + '~' + ')' + '</a>' + '</li>' 
          } else {
            del(element.title, element.time, element.description, element.address);
          }
        });
        currentLives = currentLives + '</ul>';
        nextLives = nextLives + '</ul>';
        res.write('<!DOCTYPE html><html lang="ja"><body><a href="/entry">配信情報の登録</a>' +
        '<h1>現在配信中</h1>' +
        currentLives +
        '<h1>これから配信</h1>' +
        nextLives +
        '</body></html>');
      } else if (req.url === '/entry') {
        res.write(
          pug.renderFile('./form.pug', {
            path: req.url
          })
        );
      } else if (liveAdds.includes(req.url)) {
          let ind = liveAdds.indexOf(req.url)
          res.write(
            pug.renderFile('./live.pug', {
              title: lives[ind].title,
              time: lives[ind].time,
              description: lives[ind].description
            })
          );
      }
      res.end();
      break;
    case 'POST':
      let rawData = '';
      req.on('data', chunk => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const qs = require('querystring');
        const answer = qs.parse(rawData);
        add(answer['title'], answer['time'], answer['description'], randomAddressGenerator());
        console.info(answer['title']);
        console.info(answer['time']);
        console.info(answer['description']);
        res.writeHead(302, { Location: "/" });
        res.end();
      });
      break;
    default:
      break;  
  }
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