const console = require('./console');
const dirFiles = require('./dirFiles');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const fileSymbol = require('./fileSymbol');
const packageName = require('./packageName');
const symbolName = require('./symbolName');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks')
const initWiki = require('./initWiki');
const path = require('path');

const DEFAULT =
  'Description.\n\n'+
  '> Alternatives: none.\n'+
  '> Similar: none.\n\n<br>\n\n'+
  '```javascript\n```\n\n'+
  '```javascript\n```\n\n<br>\n<br>\n\n\n'+
  '## References\n\n'+
  '- none\n';


function doWiki(dir, jsdocs, o) {
  var dir = dir||'wiki';
  console.log(`Updating Wiki ...`);
  initWiki(o.sourceDir, o);
  for(var f of dirFiles(dir)) {
    var base = fileSymbol(f);
    var name = packageName(base, o.nameRoot);
    var symbol = symbolName(base, o.symbolRoot);
    var pth = path.join(dir, f);
    var md = fileRead(pth)||DEFAULT;
    var jsdoc = jsdocs.get(base);
    if(!jsdoc) { console.error(`WikiError: No JSDoc for ${pth}`); continue; }
    var diffCodeBlocks = gitDiffCodeBlocks(pth).length>0;
    var p = Object.assign({}, o, {name, symbol, diffCodeBlocks});
    md = mdSetJsdoc(md, jsdoc, p);
    if (o.wikiHeader) md = mdLinkBasics(md, o.wikiHeader, p);
    if (o.wikiLinks)  md = mdLinkWikis(md, p);
    fileWrite(pth, md);
  }
}
module.exports = doWiki;
