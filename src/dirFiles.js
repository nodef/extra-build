const dirRead = require('./dirRead');
const fileIs = require('./fileIs');

// Gets public files in an directory.
function dirFiles(dir) {
  return dirRead(dir).filter(fileIs);
}
module.exports = dirFiles;
