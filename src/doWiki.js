const console = require('./console');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const packageName = require('./packageName');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks')
const initWiki = require('./initWiki');
const fs = require('fs');
const path = require('path');


function updateWiki(dir, jsdocs, o) {
  var dir = dir||'wiki', o = o||{};
  var headerHeavy = false;
  console.log(`Updating Wiki ...`);
  initWiki(o.sourceDir, o);
  for(var f of dirFiles(dir)) {
    var symbol = fileSymbol(f);
    var name = packageName(symbol, o.nameRoot);
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var jsdoc = jsdocs.get(symbol);
    if(!jsdoc) { console.error(`WikiError: No JSDoc for ${p}`); continue; }
    var diffCodeBlocks = gitDiffCodeBlocks(p).length>0;
    var o1 = Object.assign({}, o, {name, symbol, diffCodeBlocks, headerHeavy});
    md = mdSetJsdoc(md, jsdoc, o1);
    md = mdLinkWikis(md, o1);
    md = mdLinkBasics(md, o1);
    fs.writeFileSync(p, md);
  }
}
module.exports = updateWiki;
