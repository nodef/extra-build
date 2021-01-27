const fs = require('fs');


/**
 * Write markdown file.
 * @param {string} pth path of markdown file
 * @param {string} d markdown data
 */
function mdWrite(pth, d) {
  var pth = pth||'README.md';
  fs.writeFileSync(pth, d);
}
module.exports = mdWrite;
