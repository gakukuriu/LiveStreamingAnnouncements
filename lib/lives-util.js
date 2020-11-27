'use strict';

const fs = require('fs');
const { toNamespacedPath } = require('path');
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
  lives.push({title: tt, time: tm, timeJa: timeToJa(tm), description: desc, address: addr});
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

function timeToJa(tm) {
  const date = new Date(tm);
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土" ];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dayOfWeek = dayOfWeekStr[date.getDay()];
  return year + '年' + month + '月' + day + '日' + '(' + dayOfWeek  + ') ' + hour + ':' + minute + '〜'  
}

module.exports = {
  nowLives,
  add,
  del
};