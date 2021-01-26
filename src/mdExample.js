const mdCodeBlocks = require('./mdCodeBlocks');
const jsUncomment = require('./jsUncomment');


/**
 * Get example from markdown.
 * @param {string} md markdown data
 * @param {RegExp} re language (javascript)
 */
function mdExample(md, re=null) {
  var bs = mdCodeBlocks(md, re);
  var b = bs[1] || bs[0] || '';
  return jsUncomment(b);
}
module.exports = mdExample;
