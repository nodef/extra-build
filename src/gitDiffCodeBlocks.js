const gitDiff = require('./gitDiff');
const mdCodeBlocks = require('./mdCodeBlocks');


// Gets git diff in code blocks.
function gitDiffCodeBlocks(pth, re=null) {
  var d = gitDiff(pth);
  var bs = mdCodeBlocks(d, re);
  return bs.filter(b => /^[\+\-]/m.test(b));
}
module.exports = gitDiffCodeBlocks;
