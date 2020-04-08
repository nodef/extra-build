const jsJsdoc = require('./jsJsdoc');
const fs = require('fs');
const path = require('path');


function dirJsdocs(dir) {
  var os = new Map();
  for(var f of fs.readdirSync(dir)) {
    if(!f.endsWith('.js')) continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    var name = f.replace(/[?]*\.js/, '');
    var p = path.join(dir, f);
    var js = fs.readFileSync(p, 'utf8');
    var o = jsJsdoc(js);
    if(!o) { console.log('dirJsdocs: no jsdoc for '+p); }
    os.set(name, o);
  }
  return os;
}
module.exports = dirJsdocs;
