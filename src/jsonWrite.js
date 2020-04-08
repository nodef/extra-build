const fs = require('fs');


function jsonWrite(v, pth='package.json') {
  var d = JSON.stringify(v, null, 2);
  fs.writeFileSync(pth, d);
}
module.exports = jsonWrite;
