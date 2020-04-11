const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdSetLinks = require('./mdSetLinks');
const fs = require('fs');
const path = require('path');

const OPTIONS = {
  org: ORG,
  package: PACKAGE,
  symbol: SYMBOL
};


function updateWiki(dir, jsdocs, o) {
  var dir = dir||'wiki';
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateWiki:', dir, o);
  for(var f of dirFiles(dir)) {
    var symbol = fileSymbol(f);
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var jsdoc = jsdocs.get(symbol);
    if(!jsdoc) { console.log('updateWiki: no jsdoc for '+p); continue; }
    md = mdSetJsdoc(md, jsdoc, Object.assign({}, o, {symbol}));
    md = mdSetLinks(md, o);
    fs.writeFileSync(p, md);
  }
}
module.exports = updateWiki;
