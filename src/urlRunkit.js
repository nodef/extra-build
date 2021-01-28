/**
 * Get RunKit URL.
 * @param {options} o options {name}
 */
function urlRunkit(o) {
  return `https://npm.runkit.com/${o.name||o.nameRoot}`;
}
module.exports = urlRunkit;
