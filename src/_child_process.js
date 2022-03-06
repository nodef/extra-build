const cp      = require('child_process');
const console = require('./_console');




/**
 * Execute command with output.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function exec(cmd, o) {
  var o = Object.assign({stdio: [0, 1, 2]}, o);
  return cp.execSync(cmd.replace(/^\./, ''), o);
}


/**
 * Execute command with output, and print the command.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execLog(cmd, o) {
  console.info(`$ ${cmd}`);
  var a = exec(cmd, o);
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
  var o = Object.assign({encoding: 'utf8'}, o);
  return cp.execSync(cmd, o).trim();
}


/**
 * Execute command, get its output as string, and print the command.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execStrLog(cmd, o) {
  console.info(`$ ${cmd}`);
  var a = execStr(cmd, o);
  console.info();
  return a;
}
module.exports = {exec, execLog, execStr, execStrLog};
