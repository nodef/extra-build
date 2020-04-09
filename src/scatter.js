const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const STANDALONE = require('./STANDALONE');
const cpExec = require('./cpExec');
const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const packageScatter = require('./packageScatter');
const packageMinify = require('./packageMinify');
const snakeCase = require('./snakeCase');
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
    var tmp = packageScatter(pth, o);
    cpExec('npm publish', {cwd: tmp});
    var standalone = snakeCase(fileName(f), '_');
    standalone = o.standalone_root+'_'+standalone;
    packageMinify(tmp, Object.assign({standalone}, o));
    cpExec('npm publish', {cwd: tmp});
    cpExec(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = o.standalone_root;
  packageMinify('.', Object.assign({standalone}, o));
  cpExec('npm publish');
}
module.exports = scatter;
