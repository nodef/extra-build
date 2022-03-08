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


/**
 * Temporary file Write function.
 * @callback TemporaryFileWriteFunction
 * @param {string} path file path
 * @param {string} data file data
 */
/**
 * Restore a file after temporary operation.
 * @param {string} pth path of file
 * @param {TemporaryFileWriteFunction} fn temporary file write function
 */
function restoreFileSync(pth, fn) {
  var d = fs.existsSync(pth)? fs.readFileSync(pth, 'utf8') : null;
  fn(pth, d);
  if (d != null) fs.writeFileSync(pth, d);
  else if (fs.existsSync(pth)) fs.unlinkSync(pth);
}
module.exports = Object.assign({
  readFileTextSync, writeFileTextSync,
  readJsonSync, writeJsonSync,
  restoreFileSync,
}, fs);
