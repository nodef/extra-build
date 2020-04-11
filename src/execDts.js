const cpExec = require('./cpExec');
const snakeCase = require('./snakeCase');
const fs = require('fs');
const os = require('os');

const {EOL} = os;


function execDts(pth, o) {
  var pth = pth||'src/index.ts';
  var o = Object.assign({outFile: 'index.d.ts', noBanner: true}, o);
  var cmd = '.dts-bundle-generator', dts = o.outFile;
  for(var k in o) {
    var f = snakeCase(k);
    if(typeof o[k]==='boolean') cmd += ` --${f}`;
    else cmd += ` --${f} "${o[k]}"`;
  }
  cmd += ` "${pth}"`;
  cpExec(cmd);
  if(!o.package_root) return;
  var d = fs.readFileSync(dts, 'utf8');
  d = `declare module '${o.package_root}' {`+EOL+d+`}`+EOL;
  fs.writeFileSync(dts, d);
}
module.exports = execDts;
