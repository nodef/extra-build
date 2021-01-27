/**
 * Get options as string.
 * @param {object} o options
 * @param {function} fn key transform
 * @param {Set<string>} exc key exceptions
 */
function optionStringify(o, fn=null, exc=new Set()) {
  var a = '';
  for (var k in o) {
    var f = fn? fn(k) : k;
    if (exc.has(k) || o[k] == null) continue;
    if (typeof o[k] === 'boolean') a += ` --${f}`;
    else cmd += ` --${f} "${o[k]}"`;
  }
  return a;
}
module.exports = optionStringify;
