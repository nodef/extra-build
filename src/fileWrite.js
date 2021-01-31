const eolSet = require('./eolSet');
const fs = require('fs');


/**
 * Write file data with system EOL.
 * @param {string} pth file path
 * @param {string} x data
 */
function fileWrite(pth, x) {
  fs.writeFileSync(pth, eolSet(x));
}
module.exports = fileWrite;
