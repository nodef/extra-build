/**
 * Get code blocks in markdown.
 * @param {string} md markdown data
 * @param {RegExp} re language (javascript)
 */
function mdCodeBlocks(md, re=null) {
  var re = re||/javascript/, a = [];
  var rex = /```(\w*)(.*?)```/gs, m = null;
  while((m=rex.exec(md))!=null) {
    var [, lang, code] = m;
    if(re.test(lang)) a.push(code.trim());
  }
  return a;
}
module.exports = mdCodeBlocks;
