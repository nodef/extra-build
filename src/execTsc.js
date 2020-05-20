const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');
const fs = require('fs');

const OPTIONS = {
  target: 'es2018',
  module: 'es2015',
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  moduleResolution: 'node'
};


function execTsc(pth, o) {
  var pth = pth||'index.ts';
  var {build} = Object.assign({build: 'tsconfig.json'}, o);
  var hasBuild = build? fs.existsSync(build) : false;
  var o = Object.assign({}, hasBuild? {build} : OPTIONS, o);
  console.log('execTsc:', pth, o);
  var cwd = packageRoot(pth), cmd = '.tsc';
  for(var k in o) {
    if(o[k]==null) continue;
    if(typeof k==='boolean') cmd += ` --${k}`;
    else cmd += ` --${k} "${o[k]}"`;
  }
  if(!hasBuild) cmd += ` "${pth}"`;
  cpExec(cmd, {cwd});
}
module.exports = execTsc;
