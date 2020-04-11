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
  var pth = pth||'src/index.ts';
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateExports:', o, pth);
  var dir = path.dirname(pth), d = '';
  for(var f of dirFiles(dir)) {
    var file = fileName(f);
    var symbol = fileSymbol(f);
    if(o.format!=='es') d += `exports.${symbol} = require('./${file}');`+EOL;
    else d += `export {default as ${symbol}} from './${file}';`+EOL;
  }
  fs.writeFileSync(pth, d);
}
module.exports = updateExports;
