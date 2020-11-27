'use strict';
const pug = require('pug');
const lv = require('./lives-util');
const util = require('./handler-util');
const md = require('markdown-it');

function handle(req, res) {
  let lives = lv.nowLives();
  let liveAdds = lives.map(elem => elem.address);
  if (req.url === '/') {
    let currentLives = [];
    let nextLives = [];
    const now = Date.now();
    console.log(now);
    const oneHour = 60 * 60 * 1000;
    lives.forEach(element => {
      var liveTime = new Date(element.time);
      var liveTimeSec = liveTime.getTime()
      console.log(liveTimeSec);
      if ((now <= (liveTime.getTime() + oneHour)) && (liveTime.getTime() <= now)) {
        currentLives.push(element);
      } else if (now < liveTime.getTime()) {
        nextLives.push(element);
      } else {
        lv.del(element.title, element.time, element.description, element.address);
      }
    });
    res.write(
      pug.renderFile('./views/index.pug', { currentLives: currentLives, nextLives: nextLives })
    );
  } else if (req.url === '/entry') {
    res.write(
      pug.renderFile('./views/form.pug', {
        path: req.url
      })
    );
  } else if (liveAdds.includes(req.url)) {
      let ind = liveAdds.indexOf(req.url)
      res.write(
        pug.renderFile('./views/live.pug', {
          title: lives[ind].title,
          timeJa: lives[ind].timeJa,
          description: lives[ind].description
        })
      );
  }
  res.end();
}

module.exports = {
  handle
};