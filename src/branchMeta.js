const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const metaKeywords = require('./metaKeywords');
const dirKeywords = require('./dirKeywords');
const packageName = require('./packageName');


// Update package.json based on scatter options.
function branchMeta(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log(`Branching metadata ${pth} ...`);
  var nam = o.name||o.nameRoot;
  var sym = o.symbol||o.symbolRoot;
  var x = jsonRead(pth);
  x.name = nam;
  x.description = o.description;
  x.main = o.main||'index.js';
  x.module = o.module||'index.mjs';
  x.exports = Object.assign({
    require: './'+x.main,
    import: './'+x.module
  }, o.exports);
  // x.type = o.type||'module';
  x.scripts = {test: 'exit'};
  x.keywords = metaKeywords(x, dirKeywords(o.keywordsDir));
  x.keywords.push(...nam.split(/\W/), sym);
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
module.exports = branchMeta;
