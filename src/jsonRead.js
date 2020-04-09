const fs = require('fs');


function jsonRead(pth) {
  var pth = pth||'package.json';
  var d = fs.readFileSync(pth, 'utf8');
  return JSON.parse(d);
}
module.exports = jsonRead;
