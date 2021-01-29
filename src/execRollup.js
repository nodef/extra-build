const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const optionStringify = require('./optionStringify');
const fs = require('fs');

const OPTIONS = {
  format: 'cjs',
  exports: 'auto'
};
const INCLUDE = new Set([
  'format',
  'exports'
]);


/**
 * Execute rollup as per config.
 * @param {string} pth input file
 * @param {options} o {config, format}
 */
function execRollup(pth, o) {
  var pth = pth||'.build/index.js';
  var config = o.rollupconfig||o['rollup-config']||'rollup.config.js';
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {rollupconfig: config} : OPTIONS, o);
  console.log(`Executing rollup as per ${config} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o, getOption);
  var cwd = packageRoot(pth);
  cpExec(`.rollup ${opts} -- "${pth}"`, {cwd});
}


function getOption(k) {
  if (k.startsWith('rollup-')) return k.substring(7);
  if (INCLUDE.has(k)) return k;
  if (k === 'rollupconfig') return 'config';
  return null;
}
module.exports = execRollup;
