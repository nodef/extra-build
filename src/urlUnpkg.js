/**
 * Get UNPKG URL.
 * @param {options} o options {package}
 */
function urlUnpkg(o) {
  return `https://unpkg.com/${o.package||o.packageRoot}/`;
}
module.exports = urlUnpkg;
