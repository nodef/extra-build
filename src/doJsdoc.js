const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');
const gitBranch = require('./gitBranch');
const initJsdoc = require('./initJsdoc');
const fs = require('fs');


/**
 * Publish JSDoc on gh-pages branch.
 * @param {string} pth main typescript file path
 * @param {object} opt options
 */
function doJsdoc(pth, opt={}) {
  var src = pth||'src/index.ts';
  var dir = fs.mkdtempSync('docs');
  var main = gitBranch();
  initJsdoc();
  cpExec(`npx typedoc "${src}" --out "${dir}"`);
  cpExec(`git checkout gh-pages`);
  cpExec(`mv "${dir}"/* ./`);
  gitCommit('');
  cpExec(`git checkout ${main}`);
}
module.exports = doJsdoc;
