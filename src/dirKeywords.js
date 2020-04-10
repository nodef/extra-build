const dirFiles = require('./dirFiles');
const fileKeyword = require('./fileKeyword');


function dirKeywords(dir) {
  var dir = dir||'src';
  return [...new Set(dirFiles(dir).map(fileKeyword))];
}
module.exports = dirKeywords;
