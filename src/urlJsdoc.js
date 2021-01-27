/**
 * Get JSDoc URL.
 * @param {options} o options {package}
 */
function urlJsdoc(o) {
  return `https://${o.org}.github.io/${o.packageRoot||o.package}`;
}
module.exports = urlJsdoc;
