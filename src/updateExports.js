const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OPTIONS = {
  format: 'cjs'
};
const {EOL} = os;


function updateExports(o={}, pth=null) {
  var o = Object.assign({}, OPTIONS, o);
  var pth = pth||'src/index.js';
  console.log('updateExports:', o, pth);
  var dir = path.dirname(pth), d = '';
  for(var f of dirFiles(dir)) {
    var n = fileName(f);
    if(o.format==='cjs') d += `exports.${n} = require('./${n}');`+EOL;
    else d += `export {default as ${n}} from './${n}';`+EOL;
  }
  fs.writeFileSync(pth, d);
}
module.exports = updateExports;
