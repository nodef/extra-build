const fs = require('fs');


function dirRead(pth) {
  return fs.existsSync(pth)? fs.readdirSync(pth):[];
}
module.exports = dirRead;
