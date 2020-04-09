const dirFiles = require('./dirFiles');
const fileKeyword = require('./fileKeyword');


// Gets keywords from directory.
function dirKeywords(dir) {
  var dir = dir||'src';
  return [...new Set(dirFiles(dir).map(fileKeyword))];
}
module.exports = dirKeywords;
