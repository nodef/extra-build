const execTsc = require('./execTsc');
const execRollup = require('./execRollup');
const execDts = require('./execDts');
const pathSplit = require('./pathSplit');
const jsDecomment = require('./jsDecomment');
const path = require('path');
const fs = require('fs');

var OPTIONS = {
  build: 'build/index.js',
  output: 'index.js'
};


function updateMain(pth, o) {
  var pth = pth||'src/index.ts';
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateMain:', pth, o);
  execTsc(pth, o.tsc);
  execRollup(o.build, o.rollup);
  execDts(pth, o.dts);
  var js1 = o.otuput;
  var [dir, fil,] = pathSplit(js1);
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(js1, 'utf8');
    d = jsDecomment(d);
    fs.writeFileSync(js1, d);
  }
}
module.exports = updateMain;
