const fs = require('fs');
const path = require('path');


// Get path to root package.
function packageRoot(pth) {
  while(!fs.existsSync(path.join(pth, 'package.json')))
    pth = path.dirname(pth);
  return pth;
}
module.exports = packageRoot;
