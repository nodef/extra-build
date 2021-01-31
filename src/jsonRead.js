const fileRead = require('./fileRead');


/**
 * Read JSON file as object.
 * @param {string} pth path of JSON file
 */
function jsonRead(pth) {
  var pth = pth||'package.json';
  var d = fileRead(pth)||'{}';
  return JSON.parse(d);
}
module.exports = jsonRead;
