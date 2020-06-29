const mdCodeBlocks = require('./mdCodeBlocks');
const jsClean = require('./jsClean');


function mdExample(md, re) {
  var bs = mdCodeBlocks(md, re);
  var md = bs.length>1? bs[1] : (bs[0]||'');
  return jsClean(md);
}
module.exports = mdExample;
