const mdCodeBlocks = require('./mdCodeBlocks');


function mdExample(x, re) {
  var bs = mdCodeBlocks(x, re);
  return bs.length>1? bs[1] : bs[0];
}
module.exports = mdExample;
