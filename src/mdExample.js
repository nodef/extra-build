const mdCodeBlocks = require('./mdCodeBlocks');
const stripComments = require('strip-comments');

function mdExample(x, re) {
  var bs = mdCodeBlocks(x, re);
  var ex = bs.length>1? bs[1] : (bs[0]||'');
  return stripComments(ex).replace(/(\r?\n)(\r?\n)+/g, '$1$2').trim()+'\n';
}
module.exports = mdExample;
