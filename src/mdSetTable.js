/**
 * Set README table from JSDoc details.
 * @param {string} md markdown data
 * @param {Set<object>} jsdocs jsdoc details
 */
function mdSetTable(md, jsdocs) {
  var i = md.search(/\|\s+Method\s+\|/);
  var top = md.substring(0, i);
  var tab = md.substring(i);
  var I = tab.search(/^[^\|]/m);
  var bot = tab.substring(I);
  var tab = tab.substring(0, I);
  var rrow = /^(\|\s+\[(.*?)\]\s+\|[^\S\r\n]*)(.*)$/gm, m = null;
  while((m=rrow.exec(tab))!=null) {
    var description = jsdocs.get(m[2])? jsdocs.get(m[2]).description: m[3];
    tab = tab.replace(m[0], m[1]+description);
  }
  return top+tab+bot;
}
module.exports = mdSetTable;
