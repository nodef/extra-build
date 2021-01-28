const cpExec = require('./cpExec');
const pathSplit = require('./pathSplit');
const fileSymbol = require('./fileSymbol');
const packageRequires = require('./packageRequires');
const packageName = require('./packageName');
const mdHeading = require('./mdHeading');
const branchMd = require('./branchMd');
const branchTs = require('./branchTs');
const branchJs = require('./branchJs');
const branchMeta = require('./branchMeta');
const doExample = require('./doExample');
const jsLinkWiki = require('./jsLinkWiki');
const tempy = require('tempy');
const path = require('path');
const fs = require('fs');


// Scatter a file as a package.
function branchOne(pth, o) {
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit(pth);
  var sym = fileSymbol(fil);
  var src = o.sourceDir;
  var wiki = o.wikiDir;
  var build = o.buildDir
  var nodeModules0 = o.modulesDir;
  var nodeModules1 = path.join(tmp, 'node_modules');
  cpExec(`mv "${nodeModules0}" "${nodeModules1}"`);
  var json0 = o.metadata;
  var json1 = path.join(tmp, 'package.json');
  fs.copyFileSync(json0, json1);
  var ext0 = path.join(src, fil+ext);
  var ext1 = path.join(tmp, 'index'+ext);
  fs.copyFileSync(ext0, ext1);
  var md0 = path.join(wiki, sym+'.md');
  var md1 = path.join(tmp, 'README.md');
  var hasMd = fs.existsSync(md0);
  if (hasMd) fs.copyFileSync(md0, md1);
  var ex1 = path.join(tmp, 'example.js');
  if (hasMd) doExample(md1, {exampleOut: ex1});
  var readme = hasMd? fs.readFileSync(md1, 'utf8'):'';
  o.name = o.name||packageName(sym);
  o.symbol = o.symbol||fileSymbol(fil+ext);
  o.description = o.description||mdHeading(readme);
  o.requires = [...packageRequires(pth)];
  console.log(`Branching package ${o.name} ...`);
  for (var r of o.requires) {
    if (!(/^[\.\/]/).test(r)) continue;
    if (path.normalize(r)===ext0) continue;
    var d = path.join(tmp, path.relative(dir, r));
    fs.copyFileSync(r, d);
  }
  if (ext==='.ts') branchTs(ext1, o.tsc);
  var js1 = path.join(tmp, 'index.js');
  var mjs1 = path.join(tmp, 'index.mjs');
  var rjs1 = path.join(build, fil+'.js');
  var d = fs.readFileSync(js1, 'utf8');
  fs.writeFileSync(js1, jsLinkWiki(d, o));
  fs.renameSync(js1, mjs1);
  if (hasMd) branchMd(md1, o);
  branchJs(mjs1, o);
  branchMeta(json1, o);
  cpExec(`.rollup -c --format=cjs --file=${js1} -- ${rjs1}`);
  cpExec(`mv "${nodeModules1}" "${nodeModules0}"`);
  return tmp;
}
module.exports = branchOne;
