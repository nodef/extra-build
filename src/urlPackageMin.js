/**
 * Get NPM min package URL.
 * @param {options} o options {package}
 */
function urlPackageMin(o) {
  return `https://www.npmjs.com/package/${o.package||o.packageRoot}.min`;
}
module.exports = urlPackageMin;
