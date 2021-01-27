const DIRBIN = require('./DIRBIN');
const cp = require('child_process');

const stdio = [0, 1, 2];


/**
 * Execute command with output.
 * @param {string} cmd command to execute
 * @param {object} o options (see child_process)
 */
function cpExec(cmd, o) {
  var o = Object.assign({stdio}, o);
  console.info(`$ ${cmd}`);
  var a = cp.execSync(cmd.replace(/^\./, DIRBIN), o);
  console.info();
  return a;
}
module.exports = cpExec;
