const jsdocParse = require('./jsdocParse');


// Reads JSDocs in js file.
function jsJsdocs(js) {
  var a = new Map(), cls = '', m = null;
  var re = /(\/\*\*.*?\*\/).*?((?:(function\*?|class|const|var|let)\s+)?([\w$]+)([^\{;]*))/gs;
  while((m=re.exec(js))!=null) {
    var [, com, def, typ, nam, arg] = m;
    if(typ==='class') { cls = nam; continue; }
    if(nam==='constructor') nam = cls;
    a.set(nam, jsdocParse(com, def||''));
  }
  return a;
}
module.exports = jsJsdocs;
