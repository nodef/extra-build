/**
 * Get wiki URL for symbol.
 * @param {string} sym symbol name
 * @param {object} o options {org, nameRoot}
 */
function urlWiki(sym, o) {
  return `https://github.com/${o.owner}/${o.repo}/wiki/${sym}`;
}
module.exports = urlWiki;
