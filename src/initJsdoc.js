const console = require('./console');
const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');



/**
 * Setup gh-pages branch for JSDoc.
 */
function initJsdoc(o) {
  var {jsdocDir: cwd} = o;
  console.log(`Creating gh-pages branch for ${url} ...`);
  cpExec(`git checkout --orphan gh-pages`, {cwd});
  cpExec(`rm -rf *`, {cwd});
  cpExec(`touch index.html`, {cwd});
  gitCommit('initial commit', {push: ' --set-upstream origin gh-pages', cwd})
}
module.exports = initJsdoc;
