const fileName = require('./fileName');


/**
 * Get identifier for file name.
 * @param {string} f file name
 */
function fileSymbol(f) {
  return fileName(f).replace(/[^\w$]/g, '');
}
module.exports = fileSymbol;
