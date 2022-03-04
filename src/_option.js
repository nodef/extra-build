const dotProp = require('dot-prop');




/**
 * Parse option value text as value.
 * @param {string} x value text
 * @returns {any} value
 */
function parseValue(x) {
  try { return JSON.parse(x); }
  catch(e) { return x; }
}


/**
 * Parse options object from arguments, for current key.
 * @param {object} o options object (updated!)
 * @param {string} k current key/flag
 * @param {string[]} a arguments
 * @param {number} i current index
 * @returns {number} next index
 */
function parseEntry(o, k, a, i) {
  k = k.replace(/\.-/, '_');
  var s = k.indexOf('=');
  if (s >= 0) dotProp.set(o, k.substring(0, s), parseValue(k.substring(s+1))); // --k=v
  else if (i+1 === a.length || a[i+1].startsWith('-')) dotProp.set(o, k, true); // --k
  else dotProp.set(o, k, parseValue(a[++i])); // --k v
  return i;
}


/**
 * Parse options object from arguments.
 * @param {object} o options object [updated!]
 * @param {string} k current key (flag)
 * @param {string[]} a arguments
 * @param {number} i current index
 * @returns {number} next index
 */
function parse(o, k, a, i) {
  if (k === '--');
  else if (k.startsWith('--')) i = parseEntry(o, k.substring(2), a, i);
  else if (k.startsWith('-'))  i = parseEntry(o, k.substring(1), a, i);
  else o.command = a[i];
  return i+1;
}


/**
 * Key transform function.
 * @callback KeyTransformFunction
 * @param {string} key key name
 * @returns {string} new key name
 */
/**
 * Convert options object to string.
 * @param {object} o options object
 * @param {KeyTransformFunction} fn key transform
 */
function stringify(o, fn=null) {
  var a = '';
  for (var k in o) {
    var f = fn? fn(k) : k;
    if (f == null || o[k] == null) continue;
    if (typeof o[k] === 'boolean') a += ` --${f}`;
    else a += ` --${f} "${o[k]}"`;
  }
  return a;
}
module.exports = {parse, stringify};
