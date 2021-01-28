/**
 * Get RunKit URL.
 * @param {options} o options {package}
 */
function urlRunkit(o) {
  return `https://npm.runkit.com/${o.subname||o.name}`;
}
module.exports = urlRunkit;
