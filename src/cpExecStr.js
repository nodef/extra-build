const cpExec = require('./cpExec');


/**
 * Execute command and get its output as string.
 * @param {string} cmd command to execute
 * @param {object} o options (see child_process)
 */
function cpExecStr(cmd, o) {
  var o = Object.assign({stdio: null, encoding: 'utf8'}, o);
  return cpExec(cmd, o).trim();
}
module.exports = cpExecStr;
