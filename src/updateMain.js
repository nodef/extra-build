const execRollup = require('./execRollup');
const pathSplit = require('./pathSplit');
const jsDecomment = require('./jsDecomment');
const path = require('path');
const fs = require('fs');


function updateMain(pth, o) {
  var pth = pth||'index.js', o = o||{};
  console.log('updateMain:', pth, o);
  execRollup(pth, o);
  var [dir, fil,] = pathSplit(pth);
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(pth, 'utf8');
    d = jsDecomment(d);
    fs.writeFileSync(pth, d);
  }
}
module.exports = updateMain;
