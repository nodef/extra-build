const PACKAGE = require('./PACKAGE');
const cpExec = require('./cpExec');
const snakeCase = require('./snakeCase');
const fs = require('fs');
const os = require('os');

const OPTIONS = {
  outFile: 'index.d.ts',
  noBanner: true,
  module: PACKAGE
};
const {EOL} = os;


function execDts(pth, o) {
  var pth = pth||'src/index.ts';
  var o = Object.assign({}, OPTIONS, o);
  var cmd = '.dts-bundle-generator', dts = o.outFile;
  for(var k in o) {
    if(k==='module') continue;
    if(o[k]==null) continue;
    var f = snakeCase(k);
    if(typeof o[k]==='boolean') cmd += ` --${f}`;
    else cmd += ` --${f} "${o[k]}"`;
  }
  cmd += ` "${pth}"`;
  cpExec(cmd);
  if(!o.module) return;
  var d = fs.readFileSync(dts, 'utf8');
  d = d.replace(/export declare/g, 'export');
  d = `declare module '${o.module}' {`+EOL+d+`}`+EOL;
  fs.writeFileSync(dts, d);
}
module.exports = execDts;
