const path = require('path');

function pathReplaceExt(p, ext) {
  var e = path.extname(p);
  return p.slice(0, p.length-e.length) + ext;
}
module.exports = pathReplaceExt;
