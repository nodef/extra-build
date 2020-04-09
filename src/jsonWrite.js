const fs = require('fs');


function jsonWrite(v, pth=null) {
  var d = JSON.stringify(v, null, 2);
  fs.writeFileSync(pth||'package.json', d);
}
module.exports = jsonWrite;
