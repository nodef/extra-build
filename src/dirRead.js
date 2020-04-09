const fs = require('fs');


// Reads directory files, if it exists.
function dirRead(pth) {
  return fs.existsSync(pth)? fs.readdirSync(pth):[];
}
module.exports = dirRead;
