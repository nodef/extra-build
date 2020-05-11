const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const fileSymbol = require('./fileSymbol');
const fileRead = require('./fileRead');
const jsExports = require('./jsExports');
const jsExportsDefine = require('./jsExportsDefine');
const jsExportsRemove = require('./jsExportsRemove');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OPTIONS = {
  format: 'es'
};
const {EOL} = os;


function updateExports(pth, o) {
  var ext = fs.existsSync('src/index.ts')? '.ts' : '.js';
  var pth = pth||`src/index${ext}`;
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateExports:', pth, o);
  var d = jsExportsRemove(fileRead(pth));
  var symbols = jsExports(d);
  var dir = path.dirname(pth);
  for(var f of dirFiles(dir)) {
    var file = fileName(f);
    var symbol = fileSymbol(f);
    if(symbols.has(symbol)) { console.log('updateExports: skipping symbol '+symbol); continue; }
    d += jsExportsDefine(symbol, file, o.format)+EOL;
  }
  fs.writeFileSync(pth, d);
}
module.exports = updateExports;
