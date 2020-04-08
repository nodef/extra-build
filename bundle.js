const tempy = require('tempy');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const snakeCase = require('./src/snakeCase');
const pathSplit = require('./src/pathSplit');
const requireResolve = require('./src/requireResolve');
const fsReadDirSync = require('./src/fsReadDirSync');
const packageRoot = require('./src/packageRoot');
const packageRequires = require('./src/packageRequires');
const wikiDownload = require('./src/wikiDownload');
const mdHeading = require('./src/mdHeading');
const mdScatter = require('./src/mdScatter');
const jsScatter = require('./src/jsScatter');
const jsonScatter = require('./src/jsonScatter');
const packageScatter = require('./src/packageScatter');
const jsMinify = require('./src/jsMinify');
const mdMinify = require('./src/mdMinify');
const jsonMinify = require('./src/jsonMinify');
const packageMinify = require('./src/packageMinify');

const ORG = 'nodef';
const PACKAGE_ROOT = require('./package.json').name;
const STANDALONE = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');
const BIN = (cp.execSync('npm prefix -g')+'/bin/').replace('\n', '');
const stdio = [0, 1, 2];
const EOL = os.EOL;



// Run on shell.
async function main(a) {
  console.log('main:', a);
  console.log({BIN, ORG, PACKAGE_ROOT, STANDALONE});
  var o = {org: ORG, package_root: PACKAGE_ROOT};
  for(var f of fsReadDirSync('src')) {
    if(path.extname(f)!=='.js') continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    try {
    var pth = path.join('src', f);
    var tmp = packageScatter(pth, o);
    cp.execSync('npm publish', {cwd: tmp, stdio});
    var standalone = snakeCase(f.replace(/\..*/, ''), '_');
    standalone = STANDALONE+'_'+standalone;
    packageMinify(tmp, Object.assign({standalone}, o));
    cp.execSync('npm publish', {cwd: tmp, stdio});
    cp.execSync(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = STANDALONE;
  packageMinify('.', Object.assign({standalone}, o));
  cp.execSync('npm publish', {stdio});
}
if(require.main===module) main(process.argv);
