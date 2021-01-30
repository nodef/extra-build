const dirFiles = require('./dirFiles');
const jsJsdocs = require('./jsJsdocs');
const fs = require('fs');
const path = require('path');


/**
 * Get parsed JSDocs from files in directory.
 * @param {string} dir path of source directory
 */
function dirJsdocs(dir) {
  var dir = dir||'src';
  var a = new Map();
  for(var f of dirFiles(dir)) {
    var p = path.join(dir, f);
    var js = fs.readFileSync(p, 'utf8');
    var b = jsJsdocs(js, p);
    if(b.size===0) console.error(`DirJSDocsError: No JSDoc found for ${p}`);
    for([k, v] of b) a.set(k, v);
  }
  return a;
}
module.exports = dirJsdocs;
