const kebabCase = require('./kebabCase');


/**
 * Get full package name.
 * @param {string} x base name
 * @param {string} r root name
 */
function packageName(x, r=null) {
  var x = kebabCase(x.replace(/\$/g, 'Update'));
  return !r? x : (!r.startsWith('@')? `@${r}/${x}` : `${r}.${x}`);
}
module.exports = packageName;
