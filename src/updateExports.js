const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const fileSymbol = require('./fileSymbol');
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
  var d = fs.existsSync(pth)? fs.readFileSync(pth, 'utf8') : '';
  d = d.replace(/exports\.\S+ = require\(\'\.\/.*?\n/g, '');
  d = d.replace(/export \{default as \S+\} from \'\..*?\n/g, '');
  var rexport1 = /exports\.(\S+)\s*=/g;
  var rexport2 = /export\s+\{\s*\S+\s+as\s+(\S+)\s*\}/g;
  var symbols = new Set(), m = null;
  while((m=rexport1.exec(d))!=null) { symbols.add(m[1]); console.log(m[1]); }
  while((m=rexport2.exec(d))!=null) { symbols.add(m[1]); console.log(m[1]); }
  var dir = path.dirname(pth);
  for(var f of dirFiles(dir)) {
    var file = fileName(f);
    var symbol = fileSymbol(f);
    if(symbols.has(symbol)) { console.log('updateExports: skipping symbol '+symbol); continue; }
    if(o.format!=='es') d += `exports.${symbol} = require('./${file}');`+EOL;
    else d += `export {default as ${symbol}} from './${file}';`+EOL;
  }
  fs.writeFileSync(pth, d);
}
module.exports = updateExports;
