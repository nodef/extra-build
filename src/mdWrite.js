const fs = require('fs');


function mdWrite(d, pth=null) {
  fs.writeFileSync(pth||'README.md', d);
}
module.exports = mdWrite;
