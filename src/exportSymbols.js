/**
 * Get exported symbols.
 * @param {string} d javascript data
 */
function exportSymbols(d) {
  var a = new Set(), m = null;
  var rexp = /export\s+\{\s*(?:(\S+)|(?:\S+\s+as\s+(\S+)))\s*\}/g;
  while((m=rexp.exec(d))!=null) a.add(m[1]||m[2]);
  return a;
}
module.exports = exportSymbols;
