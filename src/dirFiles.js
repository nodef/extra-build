const dirRead = require('./dirRead');
const fileIs = require('./fileIs');


/**
 * Get non-main files in directory.
 * @param {string} dir path of directory
 */
function dirFiles(dir) {
  return dirRead(dir).filter(fileIs);
}
module.exports = dirFiles;
