const cpExec = require('./cpExec');
const dirRead = require('./dirRead');
const fileName = require('./fileName');
const jsonRead = require('./jsonRead');
const packageScatter = require('./packageScatter');
const packageMinify = require('./packageMinify');
const snakeCase = require('./snakeCase');
const path = require('path');


const ORG = 'nodef';
const PACKAGE_ROOT = jsonRead().name;
const STANDALONE_ROOT = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');
const OPTIONS = {
  org: ORG,
  package_root: PACKAGE_ROOT,
  standalone_root: STANDALONE_ROOT
};


function dirScatter(pth, o) {
  console.log('dirScatter:', pth, o);
  var o = Object.assign({}, OPTIONS, o);
  for(var f of dirRead(pth)) {
    if(path.extname(f)!=='.js') continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    try {
    var pth = path.join(pth, f);
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
module.exports = dirScatter;
