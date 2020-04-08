// Gets code blocks from markdown string.
function mdCodeBlocks(x='', re=null) {
  var re = re||/javascript/, a = [];
  var rex = /```(\w*)(.*?)```/s, m = null;
  while((m=rex.exec(x))!=null) {
    var [, lang, code] = m;
    if(re.test(lang)) a.push(code.trim());
  }
  return a;
}
module.exports = mdCodeBlocks;
