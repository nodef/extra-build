const path = require('path');

function pathReplaceExt(p, ext) {
  var e = path.extname(p);
  return path.basename(p, e) + ext;
}
module.exports = pathReplaceExt;
