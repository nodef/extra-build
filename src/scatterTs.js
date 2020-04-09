const cpExec = require('./cpExec');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const path = require('path');
const fs = require('fs');

const OPTIONS = {
  config: true,
  target: 'es2018',
  module: 'es2015',
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  outFile: null,
  outDir: null
};


function scatterTs(pth, o) {
  var pth = pth||'index.ts';
  var o = Object.assign({}, OPTIONS, o);
  console.log('scatterTs:', pth, o);
  var dir = path.dirname(pth);
  var cfg = path.join(dir, 'tsconfig.json');
  if(!fs.existsSync(cfg)) o.config = false;
  if(o.config) {
    var c = jsonRead(cfg);
    var co = c.compilerOptions||{};
    co.outFile = undefined;
    co.outDir = undefined;
    c.include = undefined;
    c.exclude = undefined;
    jsonWrite(cfg, c);
    cpExec(`.tsc --build tsconfig.json`);
  }
  else {
    var cmd = `.tsc --target ${o.target} --module ${o.module}`;
    if(o.declaration) cmd += ` --declaration`;
    if(o.declarationMap) cmd += ` --declarationMap`;
    if(o.sourceMap) cmd += ` --sourceMap`;
    cmd += ` "${pth}"`;
    cpExec(cmd);
  }
}
module.exports = scatterTs;
