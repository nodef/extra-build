const path        = require('path');
const {kebabCase} = require('./string');




/**
 * Get file name without extension.
 * @param {string} pth file path
 * @returns {string} file name
 */
function filename(pth) {
  var f = path.basename(pth);
  return f.replace(/\..*/, '');
}


/**
 * Get symbol name for file.
 * @param {string} pth file path
 */
function symbolname(pth) {
  return filename(pth).replace(/[^\w$]+/g, '_');
}


/**
 * Get keyword name for file.
 * @param {string} pth file path
 * @returns {string} keyword name
 */
function keywordname(pth) {
  return kebabCase(filename(pth)).replace(/\W+/g, '-');
}
module.exports = Object.assign({
  filename, symbolname, keywordname
}, path);
