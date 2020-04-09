const DIRBUILD = require('./DIRBUILD');
const path = require('path');
const fs = require('fs');

const FILECI = path.join(DIRBUILD, 'data', 'travis.yml');


// Initializes continuous integration file.
function initCi(pth, o) {
  var pth = pth||'.travis.yml', o = o||{};
  if(fs.existsSync(pth)) return;
  o.cidata = o.cidata||fs.readFileSync(FILECI, 'utf8');
  console.log('initCi:', pth, o);
  fs.writeFileSync(pth, o.cidata);
}
module.exports = initCi;
