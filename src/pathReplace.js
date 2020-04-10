const path = require('path');


// '.', 'src/dir/file.js', 'out' => 'out/dir/file.js'
function pathReplace(root, from, ...to) {
  var rel = path.relative(root, from);
  var i = rel.indexOf(path.sep);
  rel = i<0? '' : rel.substring(i+1);
  return path.join(root, ...to, rel);
}
module.exports = pathReplace;
