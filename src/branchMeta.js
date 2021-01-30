const console = require('./console');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const metaKeywords = require('./metaKeywords');
const dirKeywords = require('./dirKeywords');


// Update package.json based on scatter options.
function branchMeta(pth, o) {
  var pth = pth||'package.json';
  console.log(`Branching metadata for ${o.name} ...`);
  var x = jsonRead(pth);
  x.name = o.name;
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
  x.keywords.push(...o.name.split(/\W/), o.symbol);
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
