const PACKAGE = require('./PACKAGE');
const cpExec = require('./cpExec');
const kebabCase = require('./kebabCase');
const optionStringify = require('./optionStringify');
const fs = require('fs');
const {EOL} = require('os');

// TODO: use .package? exclude if org package
const OPTIONS = {
  out: 'index.d.ts',
  noBanner: true,
  module: PACKAGE
};
const EXCLUDE = new Set([
  'module',
  'out'
]);


/**
 * Execute dts-bundle-generator for file.
 * @param {string} pth path of export file
 * @param {options} o {out, module}
 */
function execDts(pth, o) {
  var pth = pth||'src/index.ts';
  var o = Object.assign({}, OPTIONS, o);
  o.outFile = o.out;
  console.log(`Executing dts-bundle-generator for ${pth} ...`);
  console.log(`Output file is at ${o.out}`);
  var opts = optionStringify(o, kebabCase, EXCLUDE);
  cpExec(`.dts-bundle-generator ${opts} "${pth}"`);
  if (!o.module) return;
  var d = fs.readFileSync(o.out, 'utf8');
  d = d.replace(/export declare/g, 'export');
  d = `declare module '${o.module}' {`+EOL+d+`}`+EOL;
  fs.writeFileSync(o.out, d);
}
module.exports = execDts;
