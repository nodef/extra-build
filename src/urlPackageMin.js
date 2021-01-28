/**
 * Get NPM min package URL.
 * @param {options} o options {package}
 */
function urlPackageMin(o) {
  return `https://www.npmjs.com/package/${o.subname||o.name}.min`;
}
module.exports = urlPackageMin;
