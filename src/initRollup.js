const DIRBUILD = require('./DIRBUILD');
const path = require('path');
const fs = require('fs');

const FILEROLLUP = path.join(DIRBUILD, 'data', 'rollup.config.js');


function initRollup(pth, o) {
  var pth = pth||'rollup.config.js';
  var o = Object.assign({}, o);
  if(fs.existsSync(pth)) return;
  o.rollup_config = o.rollup_config||fs.readFileSync(FILEROLLUP, 'utf8');
  console.log('initRollup:', pth, o);
  fs.writeFileSync(pth, o.rollup_config);
}
module.exports = initRollup;
