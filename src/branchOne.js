const cpExec = require('./cpExec');
const pathReplaceExt = require('./pathReplaceExt');
const fileRead = require('./fileRead');
const fileSymbol = require('./fileSymbol');
const packageRequires = require('./packageRequires');
const packageName = require('./packageName');
const symbolName = require('./symbolName');
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
const standaloneName = require('./standaloneName');


// Scatter a file as a package.
function branchOne(pth, o) {
  var tmp = tempy.directory();
  var dir = path.dirname(pth);
  var fil = path.basename(pth);
  var sym = fileSymbol(fil);
  var build = path.join(o.buildDir, pathReplaceExt(fil, '.js'));
  var source = path.join(o.sourceDir, fil);
  var readme = path.join(o.wikiDir, sym+'.md');
  var hasReadme = fs.existsSync(readme);
  var p = Object.assign({}, o, {
    source: path.join(tmp, 'index.ts'),
    readme: path.join(tmp, 'README.md'),
    example: path.join(tmp, 'example.js'),
    metadata: path.join(tmp, 'package.json'),
    modulesDir: path.join(tmp, 'node_modules'),
    outjs: path.join(tmp, 'index.js'),
    outmjs: path.join(tmp, 'index.mjs')
  });
  cpExec(`cp "${source}" "${p.source}"`);
  cpExec(`cp "${o.metadata}" "${p.metadata}"`);
  cpExec(`cp -r "${o.modulesDir}" "${p.modulesDir}"`);
  if (hasReadme) cpExec(`cp "${readme}" "${p.readme}"`);
  if (hasReadme) doExample(p.readme, {example: p.example});
  // Requires
  p.requires = [...packageRequires(pth)];
  for (var r of p.requires) {
    if (!(/^[\.\/]/).test(r)) continue;
    if (path.normalize(r)===source) continue;
    var d = path.join(tmp, path.relative(dir, r));
    fs.copyFileSync(r, d);
  }
  // Properties
  var md = fileRead(p.readme);
  p.nameRoot = o.name;
  p.symbolRoot = o.symbol;
  p.name = packageName(sym, o.name);
  p.symbol = symbolName(sym, o.symbol);
  p.standalone = standaloneName(sym, o.symbol);
  p.description = mdHeading(md)||o.description;
  // Branch components
  if (fil.endsWith('.ts')) branchTs(p.source, o.tsc);
  var d = fs.readFileSync(p.outjs, 'utf8');
  fs.writeFileSync(p.outjs, jsLinkWiki(d, p));
  fs.renameSync(p.outjs, p.outmjs);
  if (hasReadme) branchMd(p.readme, p);
  branchJs(p.outmjs, p);
  branchMeta(p.metadata, p);
  cpExec(`.rollup -c --format=cjs --file=${p.outjs} -- ${build}`);
  return p;
}
module.exports = branchOne;
