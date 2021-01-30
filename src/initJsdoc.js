const console = require('./console');
const cpExec = require('./cpExec');
const gitBranchExists = require('./gitBranchExists');
const gitRemoteUrl = require('./gitRemoteUrl');
const gitCommit = require('./gitCommit');


/**
 * Setup gh-pages branch for JSDoc.
 */
function initJsdoc(o) {
  if (gitBranchExists('gh-pages')) return;
  var {jsdocDir: cwd} = o;
  cpExec(`rm -rf "${cwd}"`);
  var url = gitRemoteUrl();
  console.log(`Creating gh-pages branch for ${url} ...`);
  cpExec(`git clone ${url} "${cwd}"`);
  cpExec(`git checkout --orphan gh-pages`, {cwd});
  cpExec(`rm -rf *`, {cwd});
  gitCommit('initial commit', {push: ' --set-upstream origin gh-pages', cwd})
}
module.exports = initJsdoc;
