const fileName = require('./fileName');


/**
 * Get identifier for file.
 * @param {string} p file path
 */
function fileSymbol(p) {
  return fileName(p).replace(/[^\w$]/g, '');
}
module.exports = fileSymbol;
