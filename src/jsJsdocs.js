const jsdocParse = require('./jsdocParse');


// Reads JSDocs in js file.
function jsJsdocs(js) {
  var a = new Map(), m = null;
  var re = /(\/\*\*.*?\*\/).*?((function\*?|const|var|let)\s+([\w$]+)([^\{]*))/gs;
  while((m=re.exec(js))!=null) {
    var [, com, def, typ, nam, arg] = m;
    a.set(nam, jsdocParse(com, def||''));
  }
  return a;
}
module.exports = jsJsdocs;
