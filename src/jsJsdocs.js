const jsdocParse = require('./jsdocParse');


/**
 * Read JSDocs in js file.
 * @param {string} js javascript data
 * @param {string} loc location information (?)
 */
function jsJsdocs(js, loc='?') {
  var a = new Map(), cls = '', m = null;
  var re = /(\/\*\*.*?\*\/).*?((?:(type|enum|interface|const|var|let|function\*?|class)\s+)?([\w$]+)([^\{;]*))/gs;
  while ((m=re.exec(js)) != null) {
    var [, com, def, typ, nam, arg] = m;
    if (typ==='class') { cls = nam; continue; }
    if (nam==='constructor') nam = cls;
    a.set(nam, jsdocParse(com, def||'', loc));
  }
  return a;
}
module.exports = jsJsdocs;
