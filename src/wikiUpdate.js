const fsReadDirSync = require('./fsReadDirSync');
const mdSetJsdoc = require('./mdSetJsdoc');
const mdSetLinks = require('./mdSetLinks');
const fs = require('fs');
const path = require('path');


function docsUpdate(dir, os, ot) {
  for(var f of fsReadDirSync(dir)) {
    if(!f.endsWith('.md')) continue;
    if(f.startsWith('_')) continue;
    if(f==='Home.md') continue;
    var name = f.replace('.md', '');
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var o = os.get(name);
    if(!o) { console.log('docsUpdate: no jsdoc for '+p); continue; }
    md = mdSetJsdoc(md, Object.assign({}, ot, o));
    md = mdSetLinks(md, ot);
    fs.writeFileSync(p, md);
  }
}
module.exports = docsUpdate;
