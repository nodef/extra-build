const console = require('./console');
const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const kebabCase = require('./kebabCase');
const optionStringify = require('./optionStringify');

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
  var o = Object.assign({}, OPTIONS, o,);
  console.log(`Executing dts-bundle-generator for ${pth} ...`);
  var opts = optionStringify(o, getOption);
  cpExec(`.dts-bundle-generator ${opts} "${pth}"`);
  if (!o.moduleName) { console.error(`DtsError: Module name not defined!`); return; }
  var d = fileRead(o.outDts);
  d = d.replace(/export declare/g, 'export');
  d = `declare module '${o.moduleName}' {\n${d}}\n`;
  fileWrite(o.outDts, d);
}


function getOption(k) {
  if (k.startsWith('dts_')) return kebabCase(k.substring(4));
  if (k === 'outDts') return kebabCase('outFile');
  return null;
}
module.exports = execDts;
