const urlWiki = require('./urlWiki');


function jsdocAddWiki(com, nam, o) {
  if (com.includes(urlWiki('', o))) return com;
  var re = /(\s+\*\s+)(.*?)\n/;
  var url = urlWiki(nam, o);
  return com.replace(re, `$1$2$1[📘](${url})\n`);
}
module.exports = jsdocAddWiki;
