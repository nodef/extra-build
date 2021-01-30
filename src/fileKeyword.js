const fileName = require('./fileName');


/**
 * Get keyword for file.
 * @param {string} p file path
 */
function fileKeyword(p) {
  return fileName(p).replace(/\W/g, '');
}
module.exports = fileKeyword;
