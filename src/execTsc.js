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


/**
 * Execute tsc as per build.
 * @param {string} pth path of output file
 * @param {object} o options {build, target, module, ...}
 */
function execTsc(pth, o) {
  var pth = pth||'index.ts';
  var {build} = Object.assign({build: 'tsconfig.json'}, o);
  var hasBuild = build? fs.existsSync(build) : false;
  var o = Object.assign({}, hasBuild? {build} : OPTIONS, o);
  console.log(`Executing tsc as per ${build} ...`);
  console.log(`Output file is at ${pth}`);
  var opts = optionStringify(o);
  var cwd = packageRoot(pth);
  var out = hasBuild? '' : ` "${pth}"`;
  cpExec(`.tsc ${opts} ${out}`, {cwd});
}
module.exports = execTsc;
