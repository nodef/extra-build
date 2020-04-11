const path = require('path');


function pathSplit(x) {
  var d = path.dirname(x);
  var e = path.extname(x);
  var f = path.basename(x, e);
  return [d, f, e];
}
module.exports = pathSplit;
