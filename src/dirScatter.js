const fsReadDirSync = require('./fsReadDirSync');
const packageScatter = require('./packageScatter');
const packageMinify = require('./packageMinify');
const snakeCase = require('./snakeCase');
const path = require('path');
const cp = require('child_process');

const stdio = [0, 1, 2];


function dirScatter(pth, o) {
  console.log('dirScatter:', pth, o);
  for(var f of fsReadDirSync(pth)) {
    if(path.extname(f)!=='.js') continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    try {
    var pth = path.join(pth, f);
    var tmp = packageScatter(pth, o);
    cp.execSync('npm publish', {cwd: tmp, stdio});
    var standalone = snakeCase(f.replace(/\..*/, ''), '_');
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
