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

// Global variables.
const ORG = 'nodef';
const PACKAGE_ROOT = require('./package.json').name;
const STANDALONE = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');
const BIN = (cp.execSync('npm prefix -g')+'/bin/').replace('\n', '');
const stdio = [0, 1, 2];
const EOL = os.EOL;



// Minifies JS file in place.
function minifyJs(pth, o) {
  console.log('minifyJs: ', pth, o);
  var s = fs.statSync(pth);
  cp.execSync(BIN+`browserify ${pth} -s ${o.standalone} -o ${pth}.tmp`, {stdio});
  if(s.size<4*1024*1024) cp.execSync(BIN+`uglifyjs -c -m -o ${pth} ${pth}.tmp`, {stdio});
  else cp.execSync(`mv ${pth}.tmp ${pth}`, {stdio});
  cp.execSync(`rm -f ${pth}.tmp`, {stdio});
}

// Adds minified message to README.md in place.
function minifyReadme(pth, o) {
  console.log('minifyReadme: ', pth, o);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.note_minified||/^> .*?minified.*$/m, '');
  d = d.replace(o.note_top||/\s+```/, '<br>'+EOL+
    `> This is browserified, minified version of [${o.package}].<br>`+EOL+
    `> It is exported as global variable **${o.standalone}**.<br>`+EOL+
    `> CDN: [unpkg], [jsDelivr].`+EOL+EOL+
    `[${o.package}]: https://www.npmjs.com/package/${o.package}`+EOL+
    `[unpkg]: https://unpkg.com/${o.package}.min`+EOL+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.package}.min`+EOL+EOL+
    (o.note_topvalue||'```')
  );
  fs.writeFileSync(pth, d);
}

// Adds minified message to package.json in place.
function minifyJson(pth, o) {
  console.log('minifyJson: ', pth, o);
  var d = JSON.parse(fs.readFileSync(pth, 'utf8'));
  d.name += '.min';
  d.description = d.description.replace('.$', ' (browserified, minifined).');
  d.scripts = {test: 'exit'};
  d.devDependencies = undefined;
  fs.writeFileSync(pth, JSON.stringify(d, null, 2));
  return d.name.replace(/\.min$/, '');
}

// Minifies package in place.
function minifyPackage(pth, o) {
  console.log('minifyPackage: ', pth, o);
  var o = Object.assign({}, o);
  o.package = minifyJson(path.join(pth, 'package.json'), o);
  minifyReadme(path.join(pth, 'README.md'), o);
  minifyJs(path.join(pth, 'index.js'), o);
}

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
    minifyPackage(tmp, Object.assign({standalone}, o));
    cp.execSync('npm publish', {cwd: tmp, stdio});
    cp.execSync(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = STANDALONE;
  minifyPackage('.', Object.assign({standalone}, o));
  cp.execSync('npm publish', {stdio});
}
if(require.main===module) main(process.argv);
