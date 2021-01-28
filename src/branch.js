const cpExec = require('./cpExec');
const cpExecStr = require('./cpExecStr');
const execTsc = require('./execTsc');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const standaloneName = require('./standaloneName');
const scatterOne = require('./branchOne');
const minify = require('./minify');
const path = require('path');


function branch(dir, o) {
  var dir = dir||'src';
  console.log(`Starting branch publish for directory ${dir} ...`);
  var pth = o.source||path.join(dir, 'index.ts');
  execTsc(pth, o.tsc);
  for(var f of dirFiles(dir)) {
    try {
    var pth = path.join(dir, f);
    var tmp = scatterOne(pth, o);
    cpExec('npm publish', {cwd: tmp});
    var standalone = standaloneName(fileSymbol(f), o.symbolRoot);
    minify(tmp, Object.assign({standalone}, o));
    cpExec('npm publish', {cwd: tmp});
    cpExec(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
    console.log();
  }
  try {
  standalone = o.standaloneRoot;
  cpExec('npm pack '+o.name);
  var tgz = cpExecStr('ls *.tgz');
  cpExec(`tar -xvf ${tgz} package/ --strip-components=1`);
  cpExec('rm -rf '+tgz)
  minify('.', Object.assign({standalone}, o));
  cpExec('npm publish');
  }
  catch(e) { console.error(e); }
}
module.exports = branch;
