const fs = require('fs');


function jsonWrite(pth, v) {
  var pth = pth||'package.json';
  var d = JSON.stringify(v, null, 2);
  fs.writeFileSync(pth, d);
}
module.exports = jsonWrite;
