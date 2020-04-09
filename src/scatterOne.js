const pathSplit = require('./pathSplit');
const pathReplace = require('./pathReplace');
const fileSymbol = require('./fileSymbol');
const packageRoot = require('./packageRoot');
const packageRequires = require('./packageRequires');
const packageName = require('./packageName');
const requireResolve = require('./requireResolve');
const mdHeading = require('./mdHeading');
const scatterMd = require('./scatterMd');
const scatterTs = require('./scatterTs');
const scatterJs = require('./scatterJs');
const scatterJson = require('./scatterJson');
const tempy = require('tempy');
const path = require('path');
const fs = require('fs');


// Scatter a file as a package.
function scatterOne(pth, o) {
  var o = Object.assign({}, o);
  console.log('scatterOne:', pth, o);
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit(pth);
  var pkg = o.package_dir||packageRoot(pth);
  var src = o.src_dir||pathReplace(pkg, dir, 'src');
  var wiki = o.wiki_dir||pathReplace(pkg, dir, 'wiki');
  var json0 = path.join(pkg, 'package.json');
  var json1 = path.join(tmp, 'package.json');
  fs.copyFileSync(json0, json1);
  var md0 = path.join(wiki, fil+'.md');
  var md1 = path.join(tmp, 'README.md');
  if(fs.existsSync(md0)) fs.copyFileSync(md0, md1);
  var ex1 = path.join(tmp, 'example.js');
  if(fs.existsSync(md1)) updateExample(ex1, {readme: md1});
  var ext0 = path.join(src, fil+ext);
  var ext1 = path.join(tmp, 'index'+ext);
  if(fs.existsSync(ext0)) fs.copyFileSync(ext0, ext1);
  var readme = fs.readFileSync(md1, 'utf8');
  o.package = o.package||packageName(fil);
  o.readme = o.readme||fileSymbol(fil+ext);
  o.description = o.description||mdHeading(readme);
  o.requires = packageRequires(pth);
  for(var r of o.requires) {
    if(!(/^[\.\/]/).test(r)) continue;
    r = requireResolve(r);
    var src = path.join(dir, r);
    var dst = path.join(tmp, r);
    fs.copyFileSync(src, dst);
  }
  if(ext==='.ts') scatterTs(ext1, o);
  var js1 = path.join(tmp, fil+'.js');
  scatterMd(md1, o);
  scatterJs(js1, o);
  scatterJson(json1, o);
  return tmp;
}
module.exports = scatterOne;
