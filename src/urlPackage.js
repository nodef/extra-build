/**
 * Get NPM package URL.
 * @param {options} o options {package}
 */
function urlPackage(o) {
  return `https://www.npmjs.com/package/${o.package||o.packageRoot}`;
}
module.exports = urlPackage;
