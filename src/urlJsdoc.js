/**
 * Get JSDoc URL.
 * @param {options} o options {nameRoot}
 */
function urlJsdoc(o) {
  return `https://${o.owner}.github.io/${o.repo}/`;
}
module.exports = urlJsdoc;
