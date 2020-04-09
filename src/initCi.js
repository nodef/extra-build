const FILECI = require('./FILECI');
const fs = require('fs');


// Initializes continuous integration file.
function initCi(pth, o) {
  var pth = pth||'.travis.yml', o = o||{};
  if(fs.existsSync(pth)) return;
  o.cidata = o.cidata||fs.readFileSync(FILECI, 'utf8');
  console.log('initCi:', o, pth);
  fs.writeFileSync(pth, o.cidata);
}
module.exports = initCi;
