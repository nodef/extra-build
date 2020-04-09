const ignoreAdd = require('./ignoreAdd');

const NPMIGNORES = new Map([
  ['Parts', ['src/', 'docs/', 'wiki/', '.gitmodules']],
  ['Build', ['build.js', 'rollup.config.js', '.travis.yml']],
  ['Others', ['unused/', 'unused.*', 'TODO']]
]);


// Initializes npmignore file.
function initNpmignore(pth, o) {
  var pth = pth||'.npmignore';
  var o = Object.assign({npmignores: NPMIGNORES}, o);
  console.log('initNpmignore:', pth, o);
  ignoreAdd(pth, o.npmignores);
}
module.exports = initNpmignore;
