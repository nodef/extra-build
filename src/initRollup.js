const DIRBUILD = require('./DIRBUILD');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const path = require('path');

const FILEROLLUP = path.join(DIRBUILD, 'data', 'rollup.config.js');


// Initializes Rollup config file.
function initRollup(pth, o) {
  var pth = pth||'rollup.config.js', o = o||{};
  if(fs.existsSync(pth)) return;
  o.rollup_config = o.rollup_config||jsonRead(FILEROLLUP);
  console.log('initRollup:', pth, o);
  jsonWrite(pth, o.rollup_config);
}
module.exports = initRollup;
