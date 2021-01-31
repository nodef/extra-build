const fileWrite = require('./fileWrite');


/**
 * Write JSON data to file.
 * @param {string} pth path of JSON file
 * @param {object} v data
 */
function jsonWrite(pth, v) {
  var pth = pth||'package.json';
  var d = JSON.stringify(v, null, 2)+'\n';
  fileWrite(pth, d);
}
module.exports = jsonWrite;
