const fs = require('fs');


function mdWrite(pth, d) {
  var pth = pth||'README.md';
  fs.writeFileSync(pth, d);
}
module.exports = mdWrite;
