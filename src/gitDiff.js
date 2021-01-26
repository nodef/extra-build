const path = require('path');
const cp = require('child_process');


/**
 * Get git diff of a file.
 * @param {string} pth path of file
 */
function gitDiff(pth) {
  var f = path.basename(pth);
  var cwd = path.dirname(pth);
  var stdio = cp.execSync(`git diff "${f}"`, {cwd});
  return stdio.toString().trim();
}
module.exports = gitDiff;
