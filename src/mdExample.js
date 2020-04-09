const mdCodeBlocks = require('./mdCodeBlocks');
const jsDecomment = require('./jsDecomment');

function mdExample(x, re) {
  var bs = mdCodeBlocks(x, re);
  var x = bs.length>1? bs[1] : (bs[0]||'');
  return jsDecomment(x);
}
module.exports = mdExample;
