const fs = require('fs');


/**
 * Read JSON file as object.
 * @param {string} pth path of JSON file
 */
function jsonRead(pth) {
  var pth = pth||'package.json';
  var d = fs.readFileSync(pth, 'utf8');
  return JSON.parse(d);
}
module.exports = jsonRead;
