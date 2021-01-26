const fs = require('fs');
const {EOL} = require('os');


/**
 * Write JSON data to file.
 * @param {string} pth path of JSON file
 * @param {object} v data
 */
function jsonWrite(pth, v) {
  var pth = pth||'package.json';
  var d = JSON.stringify(v, null, 2)+EOL;
  fs.writeFileSync(pth, d);
}
module.exports = jsonWrite;
