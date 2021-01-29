const fileRead = require('./fileRead');
const fileSymbol = require('./fileSymbol');
const packageName = require('./packageName');
const symbolName = require('./symbolName');
const standaloneName = require('./standaloneName');
const packageRequires = require('./packageRequires');
const pathReplace = require('./pathReplace');
const pathReplaceExt = require('./pathReplaceExt');
const mdHeading = require('./mdHeading');
const branchMd = require('./branchMd');
const branchJs = require('./branchJs');
const branchMeta = require('./branchMeta');
const doMain = require('./doMain');
const doExample = require('./doExample');
const path = require('path');
const fs = require('fs');


// Scatter a file as a package.
function branchOne(pth, o) {
  var dir = path.dirname(pth);
  var fil = path.basename(pth);
  var sym = fileSymbol(fil);
  var doc = path.join(o.wikiDir, sym+'.md');
  var hasDoc = fs.existsSync(doc);
  if (hasDoc) fs.copyFileSync(doc, o.readme);
  // Properties
  var p = Object.assign({}, o);
  var md = fileRead(p.readme);
  p.nameRoot = o.name;
  p.symbolRoot = o.symbol;
  p.name = packageName(sym, o.name);
  p.symbol = symbolName(sym, o.symbol);
  p.standalone = standaloneName(sym, o.symbol);
  p.description = mdHeading(md)||o.description;
  p.requires = [...packageRequires(pth)];
  p.build = pathReplaceExt(pathReplace('.', pth, o.buildDir), '.js');
  console.log(`Branching for ${p.name} ...`);
  console.log(`Source file is at ${pth}`);
  // Branch components
  doMain(pth, p);
  doExample(p.readme, p);
  branchJs(p.outEs, p);
  branchJs(p.outJs, p);
  // if (fil.endsWith('.ts')) branchTs(pth, o.tsc);
  // var d = fs.readFileSync(p.outJs, 'utf8');
  // fs.writeFileSync(p.outJs, jsLinkWiki(d, p));
  // fs.renameSync(p.outJs, p.outEs);
  if (hasDoc) branchMd(p.readme, p);
  branchMeta(p.metadata, p);
  // cpExec(`.rollup -c --format=cjs --export=auto --file=${p.outjs} -- ${build}`);
  return p;
}
module.exports = branchOne;
