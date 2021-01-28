const cpExec = require('./cpExec');
const gitBranchExists = require('./gitBranchExists');
const gitCommit = require('./gitCommit');


/**
 * Setup gh-pages branch for JSDoc.
 */
function initJsdoc(o) {
  if (gitBranchExists('gh-pages')) return;
  var {jsdocDir: dir} = o;
  cpExec(`rm -rf "${dir}"`);
  var url = gitRemoteUrl();
  cpExec(`git clone ${url} "${dir}"`);
  var cwd = process.cwd();
  process.chdir(dir);
  cpExec(`git checkout --orphan gh-pages`);
  cpExec(`rm -rf *`);
  gitCommit('initial commit', {push: ' --set-upstream origin gh-pages'})
  process.chdir(cwd);
}
module.exports = initJsdoc;
