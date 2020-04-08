const fs = require('fs');


function mdHeading(pth) {
  console.log('mdHeading:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  return d.replace(/\r?\n[\s\S]*/, '').replace(/[\_\*\[\]]/g, '');
}
module.exports = mdHeading;
