const cp      = require('child_process');
const console = require('./_console');

const stdio = [0, 1, 2];




/**
 * Execute command with output.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function exec(cmd, o) {
  var o = Object.assign({stdio}, o);
  console.info(`$ ${cmd}`);
  var a = cp.execSync(cmd.replace(/^\./, ''), o);
  console.info();
  return a;
}


/**
 * Execute command and get its output as string.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execStr(cmd, o) {
  var o = Object.assign({stdio: null, encoding: 'utf8'}, o);
  return exec(cmd, o).trim();
}


/**
 * Execute command and get its output as string.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execStrSilent(cmd, o) {
  var o = Object.assign({encoding: 'utf8'}, o);
  return cp.execSync(cmd, o).trim();
}
module.exports = {exec, execStr, execStrSilent};
