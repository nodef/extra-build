const fs = require('fs');


function mdHeading(pth='README.md') {
  console.log('mdHeading:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(/\r?\n[\s\S]*/, '');
  d = d.replace(/[\_\*\[\]]/g, '');
  d = d.replace(/\*(.*?)\*/g, '$1');
  return d;
}
module.exports = mdHeading;
