const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');


function publishDo(o, fn) {
  var meta = fileRead(o.meta);
  var readme = fileRead(o.readme);
  var npmrc = fileRead(o.npmrc);
  fn(o);
  fileWrite(o.meta, meta);
  fileWrite(o.readme, readme);
  if (npmrc) fileWrite(o.npmrc, npmrc);
  else cpExec(`rm -rf "${o.npmrc}"`);
}
module.exports = publishDo;
