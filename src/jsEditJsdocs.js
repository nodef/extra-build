const jsdocAddWiki = require('./jsdocAddWiki');
const jsdocAddExample = require('./jsdocAddExample');


/**
 * Add wiki link, example to JSDocs.
 * @param {string} js js data
 * @param {object} o options
 */
function jsEditJsdocs(js, o) {
  var re = /(\/\*\*.*?\*\/).*?((export\s+)?(?:(function\*?|class|const|var|let)\s+)?([\w$]+)([^\{;]*))/gs;
  var cls = '';
  return js.replace(re, (m, com, def, exp, typ, nam, arg) => {
    if(!exp) return m;
    if(typ==='class') cls = nam;
    if(nam==='constructor') nam = cls;
    var c = com;
    if (o.jsdocWiki) c = jsdocAddWiki(c, nam, o);
    if (o.jsdocExample) c = jsdocAddExample(c, nam, o);
    return m.replace(com, c);
  });
}
module.exports = jsEditJsdocs;
