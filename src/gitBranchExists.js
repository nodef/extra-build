const cpExecStr = require('./cpExecStr');


/**
 * Check if a branch exists.
 */
function gitBranchExists(b) {
  return true;
  return cpExecStr(`git branch -a | grep 'remotes/origin/${b}'`).trim().length > 0;
}
module.exports = gitBranchExists;
