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
const doExample = require('./doExample');
const jsLinkWiki = require('./jsLinkWiki');
const kleur = require('kleur');
const tempy = require('tempy');
const path = require('path');
const fs = require('fs');

const OPTIONS = {
  org: ORG,
  packageRoot: PACKAGE,
  symbolRoot: SYMBOL
};


// Scatter a file as a package.
function scatterOne(pth, o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log(kleur.bold().cyan('scatterOne:'), pth);
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit(pth);
  var sym = fileSymbol(fil);
  var pkg = o.packageDir||packageRoot(pth);
  var src = o.srcDir||pathReplace(pkg, dir, 'src');
  var wiki = o.wikiDir||pathReplace(pkg, dir, 'wiki');
  var build = o.buildDir||pathReplace(pkg, dir, 'build');
  var nodeModules0 = path.join(pkg, 'node_modules');
  var nodeModules1 = path.join(tmp, 'node_modules');
  cpExec(`cp -r "${nodeModules0}" "${nodeModules1}"`);
  var json0 = path.join(pkg, 'package.json');
  var json1 = path.join(tmp, 'package.json');
  fs.copyFileSync(json0, json1);
  var ext0 = path.join(src, fil+ext);
  var ext1 = path.join(tmp, 'index'+ext);
  fs.copyFileSync(ext0, ext1);
  var md0 = path.join(wiki, sym+'.md');
  var md1 = path.join(tmp, 'README.md');
  var hasMd = fs.existsSync(md0);
  if(hasMd) fs.copyFileSync(md0, md1);
  else console.log('scatterOne:', md0, 'not found');
  var ex1 = path.join(tmp, 'example.js');
  if(hasMd) doExample(ex1, {readmePath: md1});
  var readme = hasMd? fs.readFileSync(md1, 'utf8'):'';
  o.package = o.package||packageName(sym);
  o.symbol = o.symbol||fileSymbol(fil+ext);
  o.description = o.description||mdHeading(readme);
  o.requires = [...packageRequires(pth)];
  console.log('scatterOne:', o);
  for(var r of o.requires) {
    if(!(/^[\.\/]/).test(r)) continue;
    if(path.normalize(r)===ext0) continue;
    var d = path.join(tmp, path.relative(dir, r));
    fs.copyFileSync(r, d);
  }
  if(ext==='.ts') scatterTs(ext1, o.tsc);
  var js1 = path.join(tmp, 'index.js');
  var mjs1 = path.join(tmp, 'index.mjs');
  var rjs1 = path.join(build, fil+'.js');
  var d = fs.readFileSync(js1, 'utf8');
  fs.writeFileSync(js1, jsLinkWiki(d, o));
  fs.renameSync(js1, mjs1);
  if(hasMd) scatterMd(md1, o);
  scatterJs(mjs1, o);
  scatterJson(json1, o);
  cpExec(`.rollup -c --format=cjs --file=${js1} -- ${rjs1}`);
  return tmp;
}
module.exports = scatterOne;
