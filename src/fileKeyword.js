const fileName = require('./fileName');


/**
 * Get keyword for file name.
 * @param {string} f file name
 */
function fileKeyword(f) {
  return fileName(f).replace(/\W/g, '');
}
module.exports = fileKeyword;
