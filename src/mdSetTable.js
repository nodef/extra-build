/**
 * Set README table from JSDoc details.
 * @param {string} md markdown data
 * @param {Set<object>} jsdocs jsdoc details
 */
function mdSetTable(md, jsdocs) {
  var i = md.search(/\|\s+(Name|Method)\s+\|/);
  var top = md.substring(0, i);
  var tab = md.substring(i);
  var I = tab.search(/^[^\|]/m);
  var bot = tab.substring(I);
  var tab = tab.substring(0, I), tabw = tab;
  var rrow = /^(\|\s+\[(.*?)\]\s+\|[^\S\n]*)(.*)$/gm, m = null;
  while ((m=rrow.exec(tab)) != null) {
    var description = jsdocs.get(m[2])? jsdocs.get(m[2]).description : m[3];
    tabw = tabw.replace(m[0], m[1].trimRight()+' '+description);
  }
  return top+tabw+bot;
}
module.exports = mdSetTable;
