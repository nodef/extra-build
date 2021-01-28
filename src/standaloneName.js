const symbolName = require('./symbolName');


/**
 * Get full standalone name.
 * @param {string} x base name
 * @param {string} r root name
 */
function standaloneName(x, r=null) {
  return symbolName(x, r).replace(/\W+/, '_');
}
module.exports = standaloneName;
