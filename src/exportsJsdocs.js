const jsJsdocs = require('./jsJsdocs');
const fs = require('fs');
const path = require('path');


function exportsJsdocs(pth) {
  var ext = fs.existsSync('src/index.ts')? '.ts' : '.js';
  var pth = pth||`src/index${ext}`;
  var dir = path.dirname(pth);
  var cwd = process.cwd;
  process.chdir(dir);
  console.log('exportsJsdocs:', pth);
  var d = fs.existsSync(pth)? fs.readFileSync(pth, 'utf8') : '';
  var rimport = /require\(\s*[\'\"](.*?)[\'\"]\s*\)|from\s+[\'\"](.*?)[\'\"]/g;
  require.extensions['.ts'] = require.extensions['.js'];
  var a = new Map(), m = null;
  while((m=rimport.exec(d))!=null) {
    var p = require.resolve(m[1] || m[2]);
    var js = fs.existsSync(p)? fs.readFileSync(p, 'utf8') : '';
    var b = jsJsdocs(js);
    if(b.size===0) { console.log('exportsJsdocs: no jsdoc for '+p); }
    for([k, v] of b) a.set(k, v);
  }
  process.chdir(cwd);
  return a;
}
module.exports = exportsJsdocs;
