/**
 * Get NPM min package URL.
 * @param {options} o options {name}
 */
function urlPackageMin(o) {
  return `https://www.npmjs.com/package/${o.name||o.nameRoot}.min`;
}
module.exports = urlPackageMin;
