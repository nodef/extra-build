const fs = require('fs');


/**
 * Read markdown file.
 * @param {string} pth path of markdown file
 */
function mdRead(pth) {
  var pth = pth||'README.md';
  return fs.readFileSync(pth, 'utf8');
}
module.exports = mdRead;
