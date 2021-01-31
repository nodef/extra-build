/**
 * Get code blocks in markdown.
 * @param {string} md markdown data
 * @param {RegExp} re language (javascript)
 */
function mdCodeBlocks(md, re=null) {
  var a = [], m = null;
  var re = /```javascript\n([\s\S]*?)```\n/g;
  while((m=re.exec(md))!=null) {
    var [, code] = m;
    a.push(code.trim());
  }
  return a;
}
module.exports = mdCodeBlocks;
