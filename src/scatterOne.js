const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const cpExec = require('./cpExec');
const pathSplit = require('./pathSplit');
const pathReplace = require('./pathReplace');
const fileSymbol = require('./fileSymbol');
const packageRoot = require('./packageRoot');
const packageRequires = require('./packageRequires');
const packageName = require('./packageName');
const mdHeading = require('./mdHeading');
const scatterMd = require('./scatterMd');
const scatterTs = require('./scatterTs');
const scatterJs = require('./scatterJs');
const scatterJson = require('./scatterJson');
const updateExample = require('./updateExample');
const tempy = require('tempy');
const path = require('path');
const fs = require('fs');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  symbol_root: SYMBOL
};


// Scatter a file as a package.
function scatterOne(pth, o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log('scatterOne:', pth, o);
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit(pth);
  var sym = fileSymbol(fil);
  var pkg = o.package_dir||packageRoot(pth);
  var src = o.src_dir||pathReplace(pkg, dir, 'src');
  var wiki = o.wiki_dir||pathReplace(pkg, dir, 'wiki');
  var node_modules0 = path.join(pkg, 'node_modules');
  var node_modules1 = path.join(tmp, 'node_modules');
  cpExec(`cp -r "${node_modules0}" "${node_modules1}"`);
  var json0 = path.join(pkg, 'package.json');
  var json1 = path.join(tmp, 'package.json');
  fs.copyFileSync(json0, json1);
  var ext0 = path.join(src, fil+ext);
  var ext1 = path.join(tmp, fil+ext);
  fs.copyFileSync(ext0, ext1);
  var md0 = path.join(wiki, sym+'.md');
  var md1 = path.join(tmp, 'README.md');
  if(fs.existsSync(md0)) fs.copyFileSync(md0, md1);
  else console.log('scatterOne:', md0, 'not found');
  var ex1 = path.join(tmp, 'example.js');
  if(fs.existsSync(md1)) updateExample(ex1, {readme_path: md1});
  var readme = fs.readFileSync(md1, 'utf8');
  o.package = o.package||packageName(sym);
  o.symbol = o.symbol||fileSymbol(fil+ext);
  o.description = o.description||mdHeading(readme);
  o.requires = [...packageRequires(pth)];
  for(var r of o.requires) {
    if(!(/^[\.\/]/).test(r)) continue;
    if(path.normalize(r)===ext0) continue;
    var d = path.join(tmp, path.relative(dir, r));
    fs.copyFileSync(r, d);
  }
  if(ext==='.ts') scatterTs(ext1, o.tsc);
  var js1 = path.join(tmp, 'index.js');
  var mjs1 = path.join(tmp, 'index.mjs');
  fs.renameSync(js1, mjs1);
  scatterMd(md1, o);
  scatterJs(mjs1, o);
  scatterJson(json1, o);
  cpExec(`.rollup --format=cjs --file=${js1} -- ${mjs1}`);
  return tmp;
}
module.exports = scatterOne;
