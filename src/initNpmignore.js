const ignoreAdd = require('./ignoreAdd');

const SECTIONS = new Map([
  ['Parts', ['src/', 'wiki/', '.gitmodules']],
  ['Build', ['build/', 'build.js', '.travis.yml', 'tsconfig.json', 'rollup.config.js']],
  ['Others', ['unused/', 'unused.*', 'TODO']]
]);


function initNpmignore(pth, o) {
  var pth = pth||'.npmignore';
  var o = Object.assign({sections: SECTIONS}, o);
  console.log('initNpmignore:', pth, o);
  ignoreAdd(pth, o.sections);
}
module.exports = initNpmignore;
