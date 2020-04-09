const dirRead = require('./dirRead');
const fileName = require('./fileName');
const packageScatter = require('./packageScatter');
const packageMinify = require('./packageMinify');
const snakeCase = require('./snakeCase');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');


const ORG = 'nodef';
const PACKAGE_ROOT = JSON.parse(fs.readFileSync('package.json', 'utf8')).name;
const STANDALONE_ROOT = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');
const OPTIONS = {
  org: ORG,
  package_root: PACKAGE_ROOT,
  standalone_root: STANDALONE_ROOT
};
const stdio = [0, 1, 2];


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
    cp.execSync('npm publish', {cwd: tmp, stdio});
    var standalone = snakeCase(fileName(f), '_');
    standalone = o.standalone_root+'_'+standalone;
    packageMinify(tmp, Object.assign({standalone}, o));
    cp.execSync('npm publish', {cwd: tmp, stdio});
    cp.execSync(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = o.standalone_root;
  packageMinify('.', Object.assign({standalone}, o));
  cp.execSync('npm publish', {stdio});
}
module.exports = dirScatter;
