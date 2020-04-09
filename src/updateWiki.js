const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdSetLinks = require('./mdSetLinks');
const fs = require('fs');
const path = require('path');


function updateWiki(dir, jsdocs, o) {
  var dir = dir||'wiki', o = o||{};
  for(var f of dirFiles(dir)) {
    var symbol = fileSymbol(f);
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var jsdoc = jsdocs.get(symbol);
    if(!jsdoc) { console.log('docsUpdate: no jsdoc for '+p); continue; }
    md = mdSetJsdoc(md, jsdoc, Object.assign({symbol}, o));
    md = mdSetLinks(md, o);
    fs.writeFileSync(p, md);
  }
}
module.exports = updateWiki;
