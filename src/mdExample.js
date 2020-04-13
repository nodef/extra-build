const mdCodeBlocks = require('./mdCodeBlocks');
const jsDecomment = require('./jsDecomment');


function mdExample(md, re) {
  var bs = mdCodeBlocks(md, re);
  var md = bs.length>1? bs[1] : (bs[0]||'');
  return jsDecomment(md);
}
module.exports = mdExample;
