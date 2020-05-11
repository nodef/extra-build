const fs = require('fs');

function fileRead(pth) {
  if(!fs.existsSync(pth)) return '';
  return fs.readFileSync(pth, 'utf8');
}
module.exports = fileRead;
