const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const fs = require('fs');

const OPTIONS = {
  config: fs.existsSync('tsconfig.json'),
  target: 'es2018',
  module: 'es2015',
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  outFile: null,
  outDir: null
};


function execTsc(pth, o) {
  var pth = pth||'index.ts';
  var o = Object.assign({}, OPTIONS, o);
  console.log('execTsc:', pth, o);
  var cwd = packageRoot(pth);
  if(o.config) cpExec(`.tsc --build tsconfig.json`, {cwd});
  else {
    var cmd = `.tsc --target ${o.target} --module ${o.module}`;
    if(o.declaration) cmd += ` --declaration`;
    if(o.declarationMap) cmd += ` --declarationMap`;
    if(o.sourceMap) cmd += ` --sourceMap`;
    cmd += ` "${pth}"`;
    cpExec(cmd, {cwd});
  }
}
module.exports = execTsc;
