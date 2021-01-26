const fs = require('fs');


/**
 * Reads file, or empty if not present.
 * @param {string} pth file path
 */
function fileRead(pth) {
  if(!fs.existsSync(pth)) return '';
  return fs.readFileSync(pth, 'utf8');
}
module.exports = fileRead;
