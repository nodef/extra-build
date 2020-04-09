const path = require('path');
const cp = require('child_process');


// Gets git diff of a file.
function gitDiff(pth) {
  var f = path.basename(pth);
  var cwd = path.dirname(pth);
  var stdio = cp.execSync(`git diff "${f}"`, {cwd});
  return stdio.toString().trim();
}
module.exports = gitDiff;
