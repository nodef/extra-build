const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const jsJsdocs = require('./jsJsdocs');
const fs = require('fs');
const path = require('path');


function dirJsdocs(dir) {
  var a = new Map();
  for(var f of dirFiles(dir)) {
    var name = fileName(f);
    var p = path.join(dir, f);
    var js = fs.readFileSync(p, 'utf8');
    var b = jsJsdocs(js);
    if(b.size===0) { console.log('dirJsdocs: no jsdoc for '+p); }
    for([k, v] of b) a.set(k, v);
  }
  return a;
}
module.exports = dirJsdocs;
