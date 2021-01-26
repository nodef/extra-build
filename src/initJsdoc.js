const cpExec = require('./cpExec');
const gitBranchExists = require('./gitBranchExists');
const gitCommit = require('./gitCommit');


/**
 * Setup gh-pages branch for JSDoc.
 */
function jsdocInit() {
  if (gitBranchExists('gh-pages')) return;
  var main = gitBranch();
  cpExec(`git checkout --orphan gh-pages`);
  cpExec(`git rm -rf .`);
  cpExec(`touch index.html`);
  gitCommit('initial commit', {push: ' --set-upstream origin gh-pages'})
  cpExec(`git checkout ${main}`);
}
module.exports = jsdocInit;
