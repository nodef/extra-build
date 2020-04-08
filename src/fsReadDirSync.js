const fs = require('fs');


function fsReadDirSync(pth) {
  return fs.existsSync(pth)? fs.readdirSync(pth):[];
}
module.exports = fsReadDirSync;
