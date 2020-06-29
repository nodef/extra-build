const wikiLink = require('./wikiLink');

// Add more link to jsdoc.
function jsLinkWiki(js, o) {
  var re = /(\/\*\*.*?\*\/).*?((?:(?:export\s+)?(function\*?|class|const|var|let)\s+)?([\w$]+)([^\{;]*))/gs;
  var rdesc = /(\s+\*\s+)(.*?)(\r?\n)/, cls = '';
  return js.replace(re, (m, com, def, typ, nam, arg) => {
    if(typ==='class') { cls = nam; return m; }
    if(nam==='constructor') nam = cls;
    return m.replace(com, com.replace(rdesc, `$1$2$1[more](${wikiLink(nam, o)})$3`));
  });
}
module.exports = jsLinkWiki;
