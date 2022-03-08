const fs = require('fs');
const os = require('os');




/**
 * Read file text with Unix EOL.
 * @param {string} pth file path
 * @returns {string} file text
 */
function readFileTextSync(pth) {
  var txt = fs.readFileSync(pth, 'utf8');
  return txt.replace(/\r?\n/g, '\n');
}


/**
 * Write file text with system EOL.
 * @param {string} pth file path
 * @param {string} txt file text
 */
function writeFileTextSync(pth, txt) {
  var txt = txt.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, txt);
}


/**
 * Read JSON file as object.
 * @param {string} pth path of JSON file
 * @returns {object} object
 */
function readJsonSync(pth) {
  return JSON.parse(readFileTextSync(pth));
}


/**
 * Write object to JSON file.
 * @param {string} pth path of JSON file
 * @param {object} val object
 */
function writeJsonSync(pth, val) {
  writeFileTextSync(pth, JSON.stringify(val, null, 2) + '\n');
}
module.exports = Object.assign({
  readFileTextSync, writeFileTextSync,
  readJsonSync, writeJsonSync,
}, fs);
