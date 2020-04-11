const ignoreAdd = require('./ignoreAdd');

const GITIGNORES = new Map([
  ['Generated files', ['build/', '*.d.ts', '*.map', 'index.js']]
]);


function initGitignore(pth, o) {
  var pth = pth||'.gitignore';
  var o = Object.assign({gitignores: GITIGNORES}, o);
  console.log('initGitignore:', pth, o);
  ignoreAdd(pth, o.gitignores);
}
module.exports = initGitignore;
