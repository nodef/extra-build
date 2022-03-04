const fs = require('fs');
const os = require('os');




/**
 * Read file text with Unix EOL.
 * @param {string} pth file path
 * @returns {string} file text
 */
function read(pth) {
  var txt = fs.readFileSync(pth, 'utf8');
  return txt.replace(/\r?\n/g, '\n');
}


/**
 * Write file text with system EOL.
 * @param {string} pth file path
 * @param {string} txt file text
 */
 function write(pth, txt) {
  var txt = txt.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, txt);
}


/**
 * Read directory contents.
 * @param {string} dir path of directory
 * @returns {string[]} contents of directory
 */
function readdir(dir) {
  return fs.readdirSync(dir);
}
module.exports = {read, write, readdir};
