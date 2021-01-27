/**
 * Get options as string.
 * @param {object} o options
 * @param {function} fn key transform (null => ignore)
 */
function optionStringify(o, fn=null) {
  var a = '';
  for (var k in o) {
    var f = fn? fn(k) : k;
    if (f == null || o[k] == null) continue;
    if (typeof o[k] === 'boolean') a += ` --${f}`;
    else a += ` --${f} "${o[k]}"`;
  }
  return a;
}
module.exports = optionStringify;
