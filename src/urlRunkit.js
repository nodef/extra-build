/**
 * Get RunKit URL.
 * @param {options} o options {package}
 */
function urlRunkit(o) {
  return `https://npm.runkit.com/${o.package||o.packageRoot}`;
}
module.exports = urlRunkit;
