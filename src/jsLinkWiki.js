const urlWiki = require('./urlWiki');


/**
 * Add Wiki Link to JSDocs.
 * @param {string} js js data
 * @param {object} o options
 */
function jsLinkWiki(js, o) {
  var re = /(\/\*\*.*?\*\/).*?((export\s+)?(?:(function\*?|class|const|var|let)\s+)?([\w$]+)([^\{;]*))/gs;
  var rdesc = /(\s+\*\s+)(.*?)(\r?\n)/, cls = '';
  return js.replace(re, (m, com, def, exp, typ, nam, arg) => {
    if(!exp) return m;
    if(typ==='class') cls = nam;
    if(nam==='constructor') nam = cls;
    if (m.includes(urlWiki(nam, o))) return m;
    return m.replace(com, com.replace(rdesc, `$1$2$1[📘](${urlWiki(nam, o)})$3`));
  });
}
module.exports = jsLinkWiki;
