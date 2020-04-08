const path = require('path');


// Get filename.
function requireResolve(pth) {
  var ext = path.extname(pth);
  return ['.js', '.ts', '.json'].includes(ext)? pth:pth+'.js';
}
module.exports = requireResolve;
