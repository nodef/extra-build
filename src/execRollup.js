const console = require('./console');
const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const optionStringify = require('./optionStringify');
const fs = require('fs');
const path = require('path');

const OPTIONS = {
  rollup_format: 'cjs',
  rollup_exports: 'auto'
};


/**
 * Execute rollup as per config.
 * @param {string} pth input file
 * @param {options} o {config, format}
 */
function execRollup(pth, o) {
  var pth = pth||path.join(o.buildDir||'build', 'index.js');
  var config = o.rollup_config||'rollup.config.js';
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {rollup_config: config} : OPTIONS, o);
  console.log(`Executing rollup as per ${config} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o, getOption);
  var cwd = packageRoot(pth);
  cpExec(`.rollup ${opts} -- "${pth}"`, {cwd});
}


function getOption(k) {
  if (k.startsWith('rollup_')) return k.substring(7);
  return null;
}
module.exports = execRollup;
