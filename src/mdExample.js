const mdCodeBlocks = require('./mdCodeBlocks');
const jsUncomment = require('./jsUncomment');


/**
 * Get example from markdown.
 * @param {string} md markdown data
 * @param {object} com keep comments?
 */
function mdExample(md, com) {
  var bs = mdCodeBlocks(md);
  var b = bs[1] || bs[0] || '';
  return com? b : jsUncomment(b);
}
module.exports = mdExample;
