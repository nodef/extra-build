const fs = require('fs');


function mdRead(pth=null) {
  return fs.readFileSync(pth||'README.md', 'utf8');
}
module.exports = mdRead;
