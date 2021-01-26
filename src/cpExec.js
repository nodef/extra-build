const DIRBIN = require('./DIRBIN');
const cp = require('child_process');

const stdio = [0, 1, 2];


function cpExec(cmd, o) {
  var o = Object.assign({stdio}, o);
  if (o.log) console.log('$ '+cmd);
  return cp.execSync(cmd.replace(/^\./, DIRBIN), o);
}
module.exports = cpExec;
