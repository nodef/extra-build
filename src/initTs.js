const DIRBUILD = require('./DIRBUILD');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const path = require('path');
const fs = require('fs');

const FILETS = path.join(DIRBUILD, 'data', 'tsconfig.json');


function initTs(pth, o) {
  var pth = pth||'tsconfig.json';
  var o = Object.assign({}, o);
  if(fs.existsSync(pth)) return;
  o.ts_config = o.ts_config||jsonRead(FILETS);
  console.log('initTs:', pth, o);
  jsonWrite(pth, o.ts_config);
}
module.exports = initTs;
