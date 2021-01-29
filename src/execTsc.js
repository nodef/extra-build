const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const optionStringify = require('./optionStringify');
const fs = require('fs');

const OPTIONS = {
  tsc_target: 'es2020',
  tsc_module: 'es2015',
  tsc_declaration: true,
  tsc_declarationMap: true,
  tsc_sourceMap: true,
  tsc_moduleResolution: 'node'
};


/**
 * Execute tsc as per build.
 * @param {string} pth path of output file
 * @param {object} o options {build, target, module, ...}
 */
function execTsc(pth, o) {
  var pth = pth||'index.ts';
  var config = o.tsc_build||o.tsconfig||'tsconfig.json';
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {tsc_build: config} : OPTIONS, o);
  console.log(`Executing tsc as per ${config} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o, getOption);
  var cwd = packageRoot(pth);
  var out = hasConfig? '' : ` "${pth}"`;
  cpExec(`.tsc ${opts} ${out}`, {cwd});
}


function getOption(k) {
  if (k.startsWith('tsc_')) return k.substring(4);
  return null;
}
module.exports = execTsc;
