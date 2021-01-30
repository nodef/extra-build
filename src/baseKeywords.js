const metaKeywords = require('./metaKeywords');
const dirKeywords = require('./dirKeywords');
const jsonRead = require('./jsonRead');


/**
 * Get keywords for package.
 * @param {boolean} dir include dir keywords?
 */
function baseKeywords(dir=false, o) {
  if (o.keywords) return o.keywords;
  var name = o.name.replace(/^.*?\//, '');
  var symbol = o.symbol.replace(/^.*?\./, '');
  var m = jsonRead(o.meta);
  var dk = dirKeywords(o.keywordsDir);
  var mk = metaKeywords(m, dir? [] : dk);
  if (dir) mk.push(...dk);
  mk.push(...name.split(/\W/), symbol);
  return Array.from(new Set(mk));
}
module.exports = baseKeywords;
