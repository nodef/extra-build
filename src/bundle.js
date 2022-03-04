const string  = require('./_string');
const option  = require('./_option');
const console = require('./_console');
const cp      = require('./_child_process');
const fs      = require('./_fs');

const ROLLUP_OPTIONS = {
  rollup_format: 'cjs',
  rollup_exports: 'auto'
};

// TODO: use .package? exclude if org package
const DTS_OPTIONS = {
  dts_noBanner: true
};




/**
 * Translate rollup option keys.
 * @param {string} k key name
 * @returns {string} new key name
 */
function rollupOption(k) {
  if (k.startsWith('rollup_')) return k.substring(7);
  return null;
}


/**
 * Execute rollup as per config.
 * @param {string} pth input file
 * @param {options} o {config, format}
 */
function execRollup(pth, o) {
  var pth = pth||path.join(o.buildDir||'.build', 'index.js');
  var config = o.rollup_config||'rollup.config.js';
  var hasConfig = config? fs.existsSync(config) : false;
  var o = Object.assign({}, hasConfig? {rollup_config: config} : ROLLUP_OPTIONS, o);
  console.log(`Executing rollup as per ${config} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o, rollupOption);
  var cwd = packageRoot(pth);
  cpExec(`.rollup ${opts} -- "${pth}"`, {cwd});
}




/**
 * Translate dts-bundle-generator option keys.
 * @param {string} k key name
 * @returns {string} new key name
 */
function dtsOption(k) {
  if (k.startsWith('dts_')) return string.kebabCase(k.substring(4));
  if (k === 'outDts') return string.kebabCase('outFile');
  return null;
}


/**
 * Correct typescript declarations text after generation (from dts-bundle-generator).
 * @param {string} txt typescript declarations text
 * @param {string} module module name
 * @returns {string} corrected text
 */
function correctDts(txt, module) {
  var RMODULE = /^declare module ['"](.*?)['"] \{([\s\S]*)\}\s*$/;
  txt = txt.replace(/export\s+declare/g, 'export');
  txt = txt.replace(/export\s+default\s+/, 'export = ');
  var m = RMODULE.exec(txt) || [];
  return `declare module "${module}" {\n${m[2]||txt}}\n`;
}


/**
 * Generate typescript declarations for source typescript file.
 * @param {string} pth path of source typescript file
 * @param {options} o {module}
 */
function generateDts(pth='src/index.ts', out='index.d.ts', o=null) {
  var o = Object.assign({outDts: out}, DTS_OPTIONS, o);
  console.log(`Generating declarations for ${pth} to ${out} ...`);
  var opts = option.stringify(o, dtsOption);
  cp.execLog(`.dts-bundle-generator ${opts} "${pth}"`);
  correctDts(o.outDts, o.module);
}
module.exports = {uncomment, correctDts, generateDts};
