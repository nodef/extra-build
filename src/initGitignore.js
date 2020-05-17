const ignoreAdd = require('./ignoreAdd');

const SECTIONS = new Map([
  ['Generated files', ['build/', '*.d.ts', '*.map', 'example.js', 'index.js', 'index.?js']]
]);


function initGitignore(pth, o) {
  var pth = pth||'.gitignore';
  var o = Object.assign({sections: SECTIONS}, o);
  console.log('initGitignore:', pth, o);
  ignoreAdd(pth, o.sections);
}
module.exports = initGitignore;
