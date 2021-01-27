const cpExec = require('./cpExec');
const gitBranch = require('./gitBranch');
const gitBranchExists = require('./gitBranchExists');
const gitCommit = require('./gitCommit');


/**
 * Setup gh-pages branch for JSDoc.
 */
function initJsdoc() {
  if (gitBranchExists('gh-pages')) return;
  var main = gitBranch();
  cpExec(`git checkout --orphan gh-pages`);
  cpExec(`rm -rf *`);
  cpExec(`touch index.html`);
  gitCommit('initial commit', {push: ' --set-upstream origin gh-pages'})
  cpExec(`git checkout ${main}`);
}
module.exports = initJsdoc;
