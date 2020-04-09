const dirFiles = require('./dirFiles');
const fileKeyword = require('./fileKeyword');


// Gets keywords from directory.
function dirKeywords(dir) {
  return [...new Set(dirFiles(dir).map(fileKeyword))];
}
module.exports = dirKeywords;
