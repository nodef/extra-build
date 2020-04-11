const cpExec = require('./cpExec');
const snakeCase = require('./snakeCase');
const fs = require('fs');
const os = require('os');

const {EOL} = os;


function execDts(pth, o) {
  var pth = pth||'index.d.ts';
  var o = Object.assign({outFile: pth, noBanner: true}, o);
  var cmd = '.dts-bundle-generator';
  for(var k in o) {
    var f = snakeCase(k);
    if(typeof o[k]==='boolean') cmd += ` --${f}`;
    else cmd += ` --${f} "${o[k]}"`;
  }
  cpExec(cmd);
  if(!o.package_root) return;
  var d = fs.readFileSync(pth, 'utf8');
  d = `declare module '${o.package_root}' {`+EOL+d+`}`+EOL;
  fs.writeFileSync(pth, d);
}
module.exports = execDts;
