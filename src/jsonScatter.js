const fs = require('fs');


// Update package.json based on scatter options.
function jsonScatter(pth, o) {
  console.log('jsonScatter:', pth, o);
  var d = JSON.parse(fs.readFileSync(pth, 'utf8'));
  d.name = `@${o.package_root}/${o.package}`;
  d.description = o.description;
  d.main = o.main||'index.js';
  d.scripts = {test: 'exit'};
  d.keywords.push(...o.package.split(/\W/));
  d.keywords = Array.from(new Set(d.keywords));
  d.dependencies = Object.assign({}, o.dependencies, o.devDependencies);
  var dep_pkgs = Object.keys(d.dependencies)||[];
  for(var p of dep_pkgs)
    if(!o.requires.includes(p)) d.dependencies[p] = undefined;
  d.devDependencies = undefined;
  fs.writeFileSync(pth, JSON.stringify(d, null, 2));
}
module.exports = jsonScatter;
