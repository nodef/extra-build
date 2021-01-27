const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./jsonKeywords');
const dirKeywords = require('./dirKeywords');
const packageName = require('./packageName');


// Update package.json based on scatter options.
function scatterJson(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log('scatterJson:', pth);
  var pkg = o.package || o.packageRoot;
  var sym = o.symbol  || o.symbolRoot;
  var x = jsonRead(pth);
  x.name = packageName(pkg, o);
  x.description = o.description;
  x.main = o.main||'index.js';
  x.module = o.module||'index.mjs';
  x.exports = Object.assign({
    require: './'+x.main,
    import: './'+x.module
  }, o.exports);
  // x.type = o.type||'module';
  x.scripts = {test: 'exit'};
  x.keywords = jsonKeywords(x, dirKeywords(o.keywordsDir));
  x.keywords.push(...pkg.split(/\W/), sym);
  x.keywords = Array.from(new Set(x.keywords));
  x.dependencies = Object.assign({},
    x.dependencies, x.devDependencies,
    o.dependencies, o.devDependencies
  );
  var depPkgs = Object.keys(x.dependencies)||[];
  for(var p of depPkgs)
    if(!o.requires.includes(p)) x.dependencies[p] = undefined;
  x.devDependencies = undefined;
  jsonWrite(pth, x);
}
module.exports = scatterJson;
