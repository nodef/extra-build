/**
 * Get JSDoc URL.
 * @param {options} o options {nameRoot}
 */
function urlJsdoc(o) {
  return `https://${o.org}.github.io/${o.nameRoot}/`;
}
module.exports = urlJsdoc;
