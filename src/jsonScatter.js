const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const fs = require('fs');


// Update package.json based on scatter options.
function jsonScatter(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log('jsonScatter:', pth, o);
  var x = jsonRead(pth);
  x.name = `@${o.package_root}/${o.package}`;
  x.description = o.description;
  x.main = o.main||'index.js';
  x.scripts = {test: 'exit'};
  x.keywords.push(...o.package.split(/\W/));
  x.keywords = Array.from(new Set(x.keywords));
  x.dependencies = Object.assign({}, o.dependencies, o.devDependencies);
  var dep_pkgs = Object.keys(x.dependencies)||[];
  for(var p of dep_pkgs)
    if(!o.requires.includes(p)) x.dependencies[p] = undefined;
  x.devDependencies = undefined;
  jsonWrite(pth, x);
}
module.exports = jsonScatter;
