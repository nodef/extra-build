const cpExecStr = require('./cpExecStr');


/**
 * Check if a branch exists.
 */
function gitBranchExists(b) {
  return cpExecStr(`git branch --list ${b}`) !== '';
}
module.exports = gitBranchExists;
