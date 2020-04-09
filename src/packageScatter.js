const pathSplit = require('./pathSplit');
const packageRoot = require('./packageRoot');
const packageRequires = require('./packageRequires');
const packageName = require('./packageName');
const requireResolve = require('./requireResolve');
const wikiDownload = require('./wikiDownload');
const mdHeading = require('./mdHeading');
const mdScatter = require('./mdScatter');
const jsScatter = require('./jsScatter');
const jsonScatter = require('./jsonScatter');
const tempy = require('tempy');
const path = require('path');
const fs = require('fs');


// Scatter a file as a package.
function packageScatter(pth, o) {
  var o = o||{};
  console.log('packageScatter:', pth, o);
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit(pth);
  var src = packageRoot(pth);
  var json_src = path.join(src, 'package.json');
  var readme = path.join(tmp, 'README.md');
  var main = path.join(tmp, 'index'+ext);
  var json = path.join(tmp, 'package.json');
  o.package = o.package||packageName(fil);
  o.readme = o.readme||fil.replace(/[?]+$/, '');
  wikiDownload(readme, o);
  o.description = o.description||mdHeading(readme);
  mdScatter(readme, o);
  fs.copyFileSync(pth, main);
  jsScatter(main, o);
  o.requires = packageRequires(pth);
  fs.copyFileSync(json_src, json);
  jsonScatter(json, o);
  for(var r of o.requires) {
    if(!(/^[\.\/]/).test(r)) continue;
    r = requireResolve(r);
    var src = path.join(dir, r);
    var dst = path.join(tmp, r);
    fs.copyFileSync(src, dst);
  }
  return tmp;
}
module.exports = packageScatter;
