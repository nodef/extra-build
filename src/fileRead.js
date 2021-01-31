const eolSet = require('./eolSet');
const fs = require('fs');


/**
 * Read file with Unix EOL (empty if not present).
 * @param {string} pth file path
 */
function fileRead(pth) {
  if(!fs.existsSync(pth)) return '';
  var d = fs.readFileSync(pth, 'utf8');
  return eolSet(d, '\n');
}
module.exports = fileRead;
