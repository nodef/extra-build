/**
 * Get UNPKG URL.
 * @param {options} o options {package}
 */
function urlUnpkg(o) {
  return `https://unpkg.com/${o.subname||o.name}/`;
}
module.exports = urlUnpkg;
