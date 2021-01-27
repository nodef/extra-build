const DIRBUILD = require('./DIRBUILD');
const path = require('path');
const fs = require('fs');

const FILEROLLUP = path.join(DIRBUILD, 'data', 'rollup.config.js');


/**
 * Initialize Rollup config.
 * @param {string} pth path of rollup.config.js
 * @param {object} o options
 */
function initRollup(pth, o) {
  var pth = pth||'rollup.config.js';
  var o = Object.assign({}, o);
  if(fs.existsSync(pth)) return;
  o.data = o.data||fs.readFileSync(FILEROLLUP, 'utf8');
  console.log(`Initializing Rollup config at ${pth} ...`);
  fs.writeFileSync(pth, o.data);
}
module.exports = initRollup;
