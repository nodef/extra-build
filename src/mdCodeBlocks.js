// Gets code blocks from markdown string.
function mdCodeBlocks(md, re) {
  var re = re||/javascript/, a = [];
  var rex = /```(\w*)(.*?)```/gs, m = null;
  while((m=rex.exec(md))!=null) {
    var [, lang, code] = m;
    if(re.test(lang)) a.push(code.trim());
  }
  return a;
}
module.exports = mdCodeBlocks;
