const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const STANDALONE = require('./STANDALONE');
const cpExec = require('./cpExec');
const cpExecStr = require('./cpExecStr');
const execTsc = require('./execTsc');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const standaloneName = require('./standaloneName');
const scatterOne = require('./scatterOne');
const minify = require('./minify');
const kleur = require('kleur');
const path = require('path');


function scatter(dir, o) {
  var dir = dir||'src';
  console.log(kleur.bold().magenta('scatter:'), dir, o);
  var pth = path.join(dir, 'index.ts');
  execTsc(pth, o.tsc);
  for(var f of dirFiles(dir)) {
    try {
    var pth = path.join(dir, f);
    var tmp = scatterOne(pth, o);
    cpExec('npm publish', {cwd: tmp});
    var substandalone = standaloneName(fileSymbol(f), o);
    minify(tmp, Object.assign({substandalone}, o));
    cpExec('npm publish', {cwd: tmp});
    cpExec(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
    console.log();
  }
  try {
  substandalone = o.standalone;
  cpExec('npm pack '+o.name);
  var tgz = cpExecStr('ls *.tgz');
  cpExec(`tar -xvf ${tgz} package/ --strip-components=1`);
  cpExec('rm -rf '+tgz)
  minify('.', Object.assign({substandalone}, o));
  cpExec('npm publish');
  }
  catch(e) { console.error(e); }
}
module.exports = scatter;
