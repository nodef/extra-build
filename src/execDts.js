const console = require('./console');
const cpExec = require('./cpExec');
const kebabCase = require('./kebabCase');
const optionStringify = require('./optionStringify');
const dtsRename = require('./dtsRename');

// TODO: use .package? exclude if org package
const OPTIONS = {
  outDts: 'index.d.ts',
  dts_noBanner: true
};


/**
 * Execute dts-bundle-generator for file.
 * @param {string} pth path of export file
 * @param {options} o {out, module}
 */
function execDts(pth, o) {
  var pth = pth||'src/index.ts';
  var o = Object.assign({}, OPTIONS, o);
  console.log(`Executing dts-bundle-generator for ${pth} ...`);
  var opts = optionStringify(o, getOption);
  cpExec(`.dts-bundle-generator ${opts} "${pth}"`);
  dtsRename(o.outDts, o);
}


function getOption(k) {
  if (k.startsWith('dts_')) return kebabCase(k.substring(4));
  if (k === 'outDts') return kebabCase('outFile');
  return null;
}
module.exports = execDts;
