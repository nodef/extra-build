const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const fs = require('fs');

const OPTIONS = {
  format: 'es'
};


function execRollup(pth, o) {
  var pth = pth||'index.js';
  var {config} = Object.assign({config: 'rollup.config.js'}, o);
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {config} : OPTIONS, o);
  console.log('execRollup:', pth, o);
  var cwd = packageRoot(pth), cmd = '.rollup';
  for(var k in o) {
    if(typeof k==='boolean') cmd += ` --${k}`;
    else cmd += ` --${k} "${o[k]}"`;
  }
  cmd += ` -- "${pth}"`;
  cpExec(cmd, {cwd});
}
module.exports = execRollup;
