const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const fs = require('fs');

const OPTIONS = {
  target: 'es2018',
  module: 'es2015',
  declaration: true,
  declarationMap: true,
  sourceMap: true
};


function execTsc(pth, o) {
  var pth = pth||'index.ts', o = o||{};
  var build = o.build||'tsconfig.json';
  var o = Object.assign({}, fs.existsSync(build)? {build}:OPTIONS, o);
  console.log('execTsc:', pth, o);
  var cwd = packageRoot(pth), cmd = '.tsc';
  for(var k in o) {
    if(typeof k==='boolean') cmd += ` --${k}`;
    else cmd += ` --${k} "${o[k]}"`;
  }
  cmd += ` "${pth}"`;
  cpExec(cmd, {cwd});
}
module.exports = execTsc;
