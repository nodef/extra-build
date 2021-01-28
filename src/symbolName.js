/**
 * Get full symbol name.
 * @param {string} x base name
 * @param {string} r root name
 */
function symbolName(x, r=null) {
  var x = x.replace(/^extra-/, '');
  return !r? x : `${r}.${x}`;
}
module.exports = symbolName;
