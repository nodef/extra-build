const buildRoot = require('./buildRoot');
const fs = require('fs');
const path = require('path');

const CI_FILE = path.join(buildRoot, 'data', 'travis.yml.txt');


// Initializes continuous integration file.
function initCi(o={}, pth='.travis.yml') {
  if(fs.existsSync(pth)) return;
  var ci = o.ci||fs.readFileSync(CI_FILE, 'utf8');
  fs.writeFileSync(pth, ci);
}
module.exports = initCi;
