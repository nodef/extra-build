const DIRBUILD = require('./DIRBUILD');
const path = require('path');
const fs = require('fs');

const FILECI = path.join(DIRBUILD, 'data', '.travis.yml');


/**
 * Initialize Travis CI config.
 * @param {string} pth path of .travis.yml
 * @param {object} o options
 */
function initCi(pth, o) {
  var pth = pth||'.travis.yml';
  var o = Object.assign({}, o);
  if(fs.existsSync(pth)) return;
  o.data = o.data||fs.readFileSync(FILECI, 'utf8');
  fs.writeFileSync(pth, o.data);
  console.log(`Initialized Travis CI config at ${pth}`);
}
module.exports = initCi;
