const fs = require('fs');


function jsonRead(pth=null) {
  var d = fs.readFileSync(pth||'package.json', 'utf8');
  return JSON.parse(d);
}
module.exports = jsonRead;
