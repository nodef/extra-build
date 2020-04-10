const execTsc = require('./execTsc');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const path = require('path');
const fs = require('fs');


function scatterTs(pth, o) {
  var pth = pth||'index.ts';
  var o = Object.assign({}, o);
  console.log('scatterTs:', pth, o);
  var dir = path.dirname(pth);
  var cfg = path.join(dir, 'tsconfig.json');
  if(!fs.existsSync(cfg)) o.config = false;
  if(o.config) {
    var c = jsonRead(cfg);
    var co = c.compilerOptions||{};
    co.outFile = undefined;
    co.outDir = undefined;
    c.include = undefined;
    c.exclude = undefined;
    jsonWrite(cfg, c);
  }
  execTsc(pth, o);
}
module.exports = scatterTs;
