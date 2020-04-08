const cp = require('child_process');


function gitDiff(pth='') {
  var stdio = cp.execSync(`git diff "${pth}"`);
  return stdio.toString().trim();
}
module.exports = gitDiff;
