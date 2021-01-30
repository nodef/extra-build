const path = require('path');


/**
 * Get file name without extension.
 * @param {string} p file path
 */
function fileName(p) {
  var f = path.basename(p);
  return f.replace(/\..*/, '');
}
module.exports = fileName;
