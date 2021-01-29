const cpExec = require('./cpExec');
const kebabCase = require('./kebabCase');
const optionStringify = require('./optionStringify');
const fs = require('fs');
const {EOL} = require('os');

// TODO: use .package? exclude if org package
const OPTIONS = {
  out: 'index.d.ts',
  noBanner: true,
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
  pth = fs.existsSync(pth)? pth : pth.replace(/\.d\.ts$/, '.ts');
  var o = Object.assign({outFile: o.outDts}, o);
  console.log(`Executing dts-bundle-generator for ${pth} ...`);
  var opts = optionStringify(o, k => EXCLUDE.has(k)? null : kebabCase(k));
  cpExec(`.dts-bundle-generator ${opts} "${pth}"`);
  if (!o.moduleName) { console.error(`DtsError: Module name not defined!`); return; }
  var d = fs.readFileSync(o.out, 'utf8');
  d = d.replace(/export declare/g, 'export');
  d = `declare module '${o.moduleName}' {`+EOL+d+`}`+EOL;
  fs.writeFileSync(o.out, d);
}
module.exports = execDts;
