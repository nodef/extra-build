/**
 * Get NPM package URL.
 * @param {options} o options {name}
 */
function urlPackage(o) {
  return `https://www.npmjs.com/package/${o.name||o.nameRoot}`;
}
module.exports = urlPackage;
