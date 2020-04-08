const initGitignore = require('./initGitignore');

const NPMIGNORES = new Map([
  ['Parts', ['src/', 'docs/', 'wiki/', '.gitmodules']],
  ['Build', ['build.js', 'rollup.config.js', '.travis.yml']],
  ['Others', ['unused/', 'unused.*', 'TODO']]
]);


// Initializes npmignore file.
function initNpmignore(o={}, pth='.npmignore') {
  var npmignores = o.npmignores||NPMIGNORES;
  initGitignore({gitignores: npmignores}, pth);
}
module.exports = initNpmignore;
