const path = require('path');


/**
 * Replace file extension with another.
 * @param {string} p file path
 * @param {string} ext new extension
 */
function pathReplaceExt(p, ext) {
  var e = path.extname(p);
  return p.slice(0, p.length-e.length) + ext;
}
module.exports = pathReplaceExt;
