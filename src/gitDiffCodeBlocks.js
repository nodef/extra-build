const gitDiff = require('./gitDiff');
const mdCodeBlocks = require('./mdCodeBlocks');


/**
 * Get git diff in code blocks.
 * @param {string} pth path of file
 * @param {RegExp} re language (javascript)
 */
function gitDiffCodeBlocks(pth, re=null) {
  var d = gitDiff(pth);
  var bs = mdCodeBlocks(d, re);
  return bs.filter(b => /^[\+\-]/m.test(b));
}
module.exports = gitDiffCodeBlocks;
