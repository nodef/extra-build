const fileWrite = require('./fileWrite');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const publishBase = require('./publishBase');


function publishGithub(o) {
  var m = jsonRead(o.meta);
  var name = `@${o.owner}/${m.name.replace('@', '').replace('/', '--')}`;
  var n = Object.assign({}, m, {name});
  jsonWrite(o.meta, n);
  fileWrite(o.npmrc, `registry=https://npm.pkg.github.com/${o.owner}\n`);
  publishBase(o);
}
module.exports = publishGithub;
