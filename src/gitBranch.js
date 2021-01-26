const cpExecStr = require('./cpExecStr');


/**
 * Get current branch.
 */
function gitBranch(b) {
  return cpExecStr(`git rev-parse --abbrev-ref HEAD`);
}
module.exports = gitBranch;
