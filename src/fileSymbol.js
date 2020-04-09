const fileName = require('./fileName');


function fileSymbol(f) {
  return fileName(f).replace(/[^\w$]/g, '');
}
module.exports = fileSymbol;
