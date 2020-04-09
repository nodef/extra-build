const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const STANDALONE = require('./STANDALONE');
const cpExec = require('./cpExec');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const standaloneName = require('./standaloneName');
const scatterOne = require('./scatterOne');
const minify = require('./minify');
const path = require('path');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  symbol_root: SYMBOL,
  standalone_root: STANDALONE
};


function scatter(dir, o) {
  var dir = dir||'src';
  var o = Object.assign({}, OPTIONS, o);
  console.log('scatter:', dir, o);
  for(var f of dirFiles(dir)) {
    try {
    var pth = path.join(dir, f);
    var tmp = scatterOne(pth, o);
    cpExec('npm publish', {cwd: tmp});
    var standalone = standaloneName(fileSymbol(f), o);
    minify(tmp, Object.assign({standalone}, o));
    cpExec('npm publish', {cwd: tmp});
    cpExec(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = o.standalone_root;
  minify('.', Object.assign({standalone}, o));
  cpExec('npm publish');
}
module.exports = scatter;
