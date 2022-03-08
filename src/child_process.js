const cp      = require('child_process');
const console = require('./console');




/**
 * Execute command with output, and print the command.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execLogSync(cmd, o) {
  console.info(`$ ${cmd}`);
  var o = Object.assign({stdio: [0, 1, 2]}, o);
  var a = cp.execSync(cmd, o);
  console.info();
  return a;
}


/**
 * Execute command and get its output as string.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execStrSync(cmd, o) {
  var o = Object.assign({encoding: 'utf8'}, o);
  return cp.execSync(cmd, o).trim();
}


/**
 * Execute command, get its output as string, and print the command.
 * @param {string} cmd command to execute
 * @param {cp.ExecSyncOptionsWithStringEncoding} o options (see child_process)
 * @returns {string} command output
 */
function execStrLogSync(cmd, o) {
  console.info(`$ ${cmd}`);
  var a = execStrSync(cmd, o);
  console.info();
  return a;
}
module.exports = Object.assign({
  execLogSync, execStrSync, execStrLogSync,
}, cp);
