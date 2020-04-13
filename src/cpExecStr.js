const cpExec = require('./cpExec');


function cpExecStr(cmd, o) {
  var o = Object.assign({stdio: null, encoding: 'utf8'}, o);
  return cpExec(cmd, o).trim();
}
module.exports = cpExecStr;
