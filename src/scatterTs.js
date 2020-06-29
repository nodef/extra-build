const execTsc = require('./execTsc');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const path = require('path');
const fs = require('fs');


function scatterTs(pth, o) {
  var pth = pth||'index.ts';
  var o = Object.assign({}, o);
  console.log('scatterTs:', pth);
  var dir = path.dirname(pth);
  var build = path.join(dir, 'tsconfig.json');
  if(!fs.existsSync(build)) o.build = undefined;
  if(o.build) {
    var c = jsonRead(build);
    var co = c.compilerOptions||{};
    co.outFile = undefined;
    co.outDir = undefined;
    c.include = undefined;
    c.exclude = undefined;
    jsonWrite(build, c);
  }
  execTsc(pth, o);
}
module.exports = scatterTs;
