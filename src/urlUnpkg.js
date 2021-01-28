/**
 * Get UNPKG URL.
 * @param {options} o options {name}
 */
function urlUnpkg(o) {
  return `https://unpkg.com/${o.name||o.nameRoot}/`;
}
module.exports = urlUnpkg;
