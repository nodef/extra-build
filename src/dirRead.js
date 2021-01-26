const fs = require('fs');


/**
 * Read directory contents, if it exists.
 * @param {string} dir path of directory
 */
function dirRead(dir) {
  return fs.existsSync(dir)? fs.readdirSync(dir):[];
}
module.exports = dirRead;
