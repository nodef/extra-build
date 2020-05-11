const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./jsonKeywords');
const dirKeywords = require('./dirKeywords');
const packageName = require('./packageName');


// Update package.json based on scatter options.
function scatterJson(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log('jsonScatter:', pth, o);
  var pkg = o.package || o.package_root;
  var sym = o.symbol  || o.symbol_root;
  var x = jsonRead(pth);
  x.name = packageName(pkg, o);
  x.description = o.description;
  x.main = o.main||'index.js';
  x.type = o.type||'module';
  x.scripts = {test: 'exit'};
  x.keywords = jsonKeywords(x, dirKeywords(o.keywords_dir));
  x.keywords.push(...pkg.split(/\W/), sym);
  x.keywords = Array.from(new Set(x.keywords));
  x.dependencies = Object.assign({}, o.dependencies, o.devDependencies);
  var dep_pkgs = Object.keys(x.dependencies)||[];
  for(var p of dep_pkgs)
    if(!o.requires.includes(p)) x.dependencies[p] = undefined;
  x.devDependencies = undefined;
  jsonWrite(pth, x);
}
module.exports = scatterJson;
