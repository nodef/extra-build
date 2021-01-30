const console = require('./console');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const packageName = require('./packageName');
const symbolName = require('./symbolName');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks')
const initWiki = require('./initWiki');
const fs = require('fs');
const path = require('path');


function doWiki(dir, jsdocs, o) {
  var dir = dir||'wiki';
  var headerHeavy = false;
  console.log(`Updating Wiki ...`);
  initWiki(o.sourceDir, o);
  for(var f of dirFiles(dir)) {
    var base = fileSymbol(f);
    var name = packageName(base, o.nameRoot);
    var symbol = symbolName(base, o.symbolRoot);
    var pth = path.join(dir, f);
    var md = fs.readFileSync(pth, 'utf8');
    var jsdoc = jsdocs.get(base);
    if(!jsdoc) { console.error(`WikiError: No JSDoc for ${pth}`); continue; }
    var diffCodeBlocks = gitDiffCodeBlocks(pth).length>0;
    var p = Object.assign({}, o, {name, symbol, diffCodeBlocks, headerHeavy});
    md = mdSetJsdoc(md, jsdoc, p);
    md = mdLinkWikis(md, p);
    md = mdLinkBasics(md, p);
    fs.writeFileSync(pth, md);
  }
}
module.exports = doWiki;
