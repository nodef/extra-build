const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const packageName = require('./packageName');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks')
const fs = require('fs');
const path = require('path');


function updateWiki(dir, jsdocs, o) {
  var dir = dir||'wiki', o = o||{};
  var headerHeavy = false;
  for(var f of dirFiles(dir)) {
    var subsymbol = fileSymbol(f);
    var subname = packageName(subsymbol, o);
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var jsdoc = jsdocs.get(subsymbol);
    if(!jsdoc) { console.error(`WikiError: No JSDoc for ${p}`); continue; }
    var diffCodeBlocks = gitDiffCodeBlocks(p).length>0;
    var o1 = Object.assign({}, o, {subname, subsymbol, diffCodeBlocks, headerHeavy});
    md = mdSetJsdoc(md, jsdoc, o1);
    md = mdLinkWikis(md, o1);
    md = mdLinkBasics(md, o1);
    fs.writeFileSync(p, md);
  }
}
module.exports = updateWiki;
