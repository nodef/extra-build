const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');
const gitBranch = require('./gitBranch');
const jsdocInit = require('./jsdocInit');
const fs = require('fs');


/**
 * Publish JSDoc to gh-pages branch.
 */
function jsdoc() {
  var src = 'src/index.ts';
  var dir = fs.mkdtempSync('docs');
  var main = gitBranch();
  jsdocInit();
  cpExec(`npx typedoc "${src}" --out "${dir}"`);
  cpExec(`git checkout gh-pages`);
  cpExec(`mv "${dir}"/* ./`);
  gitCommit('');
  cpExec(`git checkout ${main}`);
}
module.exports = jsdoc;
