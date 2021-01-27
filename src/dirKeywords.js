const dirFiles = require('./dirFiles');
const fileKeyword = require('./fileKeyword');


/**
 * Get keywords for files in directory.
 * @param {string} dir path of directory
 */
function dirKeywords(dir) {
  var dir = dir||'src';
  return [...new Set(dirFiles(dir).map(fileKeyword))];
}
module.exports = dirKeywords;
