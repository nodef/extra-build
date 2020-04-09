const fs = require('fs');


function mdRead(pth) {
  var pth = pth||'README.md';
  return fs.readFileSync(pth, 'utf8');
}
module.exports = mdRead;
