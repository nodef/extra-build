const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const optionStringify = require('./optionStringify');
const fs = require('fs');

const OPTIONS = {
  target: 'es2020',
  module: 'es2015',
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  moduleResolution: 'node'
};
const INCLUDE = new Set([
  'target', 'module', 'declaration', 'declarationMap',
  'sourceMap', 'moduleResolution'
]);


/**
 * Execute tsc as per build.
 * @param {string} pth path of output file
 * @param {object} o options {build, target, module, ...}
 */
function execTsc(pth, o) {
  var pth = pth||'index.ts';
  var config = o.tsconfig||o['tsc-build']||'tsconfig.json';
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {tsconfig: config} : OPTIONS, o);
  console.log(`Executing tsc as per ${config} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o, getOption);
  var cwd = packageRoot(pth);
  var out = hasConfig? '' : ` "${pth}"`;
  cpExec(`.tsc ${opts} ${out}`, {cwd});
}


function getOption(k) {
  if (k.startsWith('tsc-')) return k.substring(7);
  if (k === 'tsconfig') return 'build';
  if (INCLUDE.has(k)) return k;
  return null;
}
module.exports = execTsc;
