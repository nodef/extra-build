const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const fileSymbol = require('./fileSymbol');
const jsExportsDefine = require('./jsExportsDefine');
const os = require('os');

const {EOL} = os;

// Gets exports for a directory.
function dirExports(dir, fmt='es', exc=new Set()) {
  var a = '';
  for(var f of dirFiles(dir)) {
    var fil = fileName(f);
    var sym = fileSymbol(f);
    if(exc.has(sym)) continue;
    a += jsExportsDefine(sym, fil, fmt)+EOL;
  }
  return a;
}
module.exports = dirExports;
