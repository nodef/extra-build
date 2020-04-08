const path = require('path');


function pathSplit(x) {
  var d = path.dirname(x);
  var e = path.extname(x);
  var f = x.substring(d.length, x.length-e.length).replace(/^\//, '');
  return [d, f, e];
}
module.exports = pathSplit;
