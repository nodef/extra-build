/**
 * Get exported symbols.
 * @param {string} d javascript data
 */
function exportSymbols(d) {
  var a = new Set(), m = null;
  var rexp = /export\s+\{\s*(?:(\S+)|(?:\S+\s+as\s+(\S+)))\s*\}|export\s+(?:type|enum|interface|const|var|let|function\*?|class)\s+([\w$]+)/g;
  while((m=rexp.exec(d))!=null) a.add(m[3]||m[2]||m[1]);
  return a;
}
module.exports = exportSymbols;
