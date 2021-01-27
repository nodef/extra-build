const cpExecStr = require('./cpExecStr');


/**
 * Get current branch.
 */
function gitBranch() {
  return cpExecStr(`git rev-parse --abbrev-ref HEAD`);
}
module.exports = gitBranch;
