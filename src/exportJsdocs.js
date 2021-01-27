const fileRead = require('./fileRead');
const jsJsdocs = require('./jsJsdocs');
const path = require('path');


/**
 * Read JSDocs for files imported by an export file.
 * @param {string} pth path of export file
 */
function exportJsdocs(pth) {
  var pth = pth||'src/index.ts';
  var dir = path.dirname(pth);
  var cwd = process.cwd();
  console.log(`Reading JSDocs for files imported by ${pth} ...`);
  process.chdir(dir);
  var d = fileRead(pth);
  var rimport = /require\(\s*[\'\"](.*?)[\'\"]\s*\)|from\s+[\'\"](.*?)[\'\"]/g;
  require.extensions['.ts'] = require.extensions['.js'];
  var a = new Map(), m = null;
  while((m=rimport.exec(d))!=null) {
    var p = require.resolve(m[1] || m[2]);
    var b = jsJsdocs(fileRead(p));
    if(b.size===0) console.error(`Error: No jsdoc for ${p}`);
    for([k, v] of b) a.set(k, v);
  }
  process.chdir(cwd);
  return a;
}
module.exports = exportJsdocs;
