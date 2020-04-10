const dirRead = require('./dirRead');
const fileIs = require('./fileIs');


function dirFiles(dir) {
  return dirRead(dir).filter(fileIs);
}
module.exports = dirFiles;
