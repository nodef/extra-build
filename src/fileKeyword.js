const fileName = require('./fileName');


function fileKeyword(f) {
  return fileName(f).replace(/\W/g, '');
}
module.exports = fileKeyword;
