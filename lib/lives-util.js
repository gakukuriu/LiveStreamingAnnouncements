'use strict';

const fs = require('fs');
const fileName = './lives.json';
const data = fs.readFileSync(fileName, 'utf8');
let lives = JSON.parse(data);

function saveLives() {
  fs.writeFileSync(fileName, JSON.stringify(lives), 'utf8');
}

function sortLives(lives) {
  lives.sort((x, y) => x.time - y.time);
}

function nowLives() {
  return lives;
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

module.exports = {
  nowLives,
  add,
  del
};