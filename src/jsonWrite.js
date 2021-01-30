const fs = require('fs');
const eolSet = require('./eolSet')


/**
 * Write JSON data to file.
 * @param {string} pth path of JSON file
 * @param {object} v data
 */
function jsonWrite(pth, v) {
  var pth = pth||'package.json';
  var d = JSON.stringify(v, null, 2)+'\n';
  fs.writeFileSync(pth, eolSet(d));
}
module.exports = jsonWrite;
