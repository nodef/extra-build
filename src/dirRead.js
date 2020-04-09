const fs = require('fs');


// Reads directory files, if it exists.
function dirRead(dir) {
  return fs.existsSync(dir)? fs.readdirSync(dir):[];
}
module.exports = dirRead;
