const cpExec = require('./cpExec');
const execTsc = require('./execTsc');
const dirFiles = require('./dirFiles');
const scatterOne = require('./branchOne');
const minify = require('./minify');
const path = require('path');


function branch(dir, o) {
  var dir = dir||'src';
  console.log(`Starting branch publish for ${o.name} ...`);
  execTsc(o.source, o.tsc);
  for (var f of dirFiles(dir)) {
    try {
    var pth = path.join(dir, f);
    var p = scatterOne(pth, o);
    var cwd = path.dirname(p.metadata);
    cpExec('npm publish', {cwd});
    minify(cwd, p);
    cpExec('npm publish', {cwd});
    cpExec(`rm -rf "${cwd}"`);
    }
    catch(e) { console.error(e); }
    console.log();
  }
  try {
  // cpExec('npm pack '+o.name);
  // var tgz = cpExecStr('ls *.tgz');
  // cpExec(`tar -xvf ${tgz} package/ --strip-components=1`);
  // cpExec('rm -rf '+tgz)
  minify('.', o);
  cpExec('npm publish');
  }
  catch(e) { console.error(e); }
}
module.exports = branch;
