const symbolName = require('./symbolName');


function standaloneName(x, o) {
  return symbolName(x, o).replace(/\W+/, '_');
}
module.exports = standaloneName;
