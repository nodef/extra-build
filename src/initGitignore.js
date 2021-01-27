const ignoreAdd = require('./ignoreAdd');

const SECTIONS = new Map([
  ['Generated files', ['build/', '*.d.ts', '*.map', 'example.js', 'index.js', 'index.?js']]
]);


/**
 * Initialize Git ignore file.
 * @param {string} pth path of .gitignore
 * @param {object} o options
 */
function initGitignore(pth, o) {
  var pth = pth||'.gitignore';
  var o = Object.assign({sections: SECTIONS}, o);
  console.log(`Initializing Gitignore at ${pth} ...`);
  ignoreAdd(pth, o.sections);
}
module.exports = initGitignore;
