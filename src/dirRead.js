const fs = require('fs');


function dirRead(dir) {
  return fs.existsSync(dir)? fs.readdirSync(dir):[];
}
module.exports = dirRead;
