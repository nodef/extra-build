/**
 *
 * @param {string} x
 * @param {*} o
 */
function symbolName(x, o) {
  var x = x.replace(/^extra-/, ''), o = o||{};
  if(!o.symbolRoot) return x;
  return `${o.symbolRoot}.${x}`;
}
module.exports = symbolName;
