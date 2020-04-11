const DIRBUILD = require('./DIRBUILD');
const path = require('path');
const fs = require('fs');

const FILECI = path.join(DIRBUILD, 'data', '.travis.yml');


function initCi(pth, o) {
  var pth = pth||'.travis.yml';
  var o = Object.assign({}, o);
  if(fs.existsSync(pth)) return;
  o.data = o.data||fs.readFileSync(FILECI, 'utf8');
  console.log('initCi:', pth, o);
  fs.writeFileSync(pth, o.data);
}
module.exports = initCi;
