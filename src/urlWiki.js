/**
 * Get wiki URL for symbol.
 * @param {string} sym symbol name
 * @param {object} o options {org, package}
 */
function urlWiki(sym, o) {
  return `https://github.com/${o.org}/${o.name}/wiki/${sym}`;
}
module.exports = urlWiki;
