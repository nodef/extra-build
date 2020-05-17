const execTsc = require('./execTsc');
const execRollup = require('./execRollup');
const execDts = require('./execDts');
const pathSplit = require('./pathSplit');
const pathReplaceExt = require('./pathReplaceExt');
const jsDecomment = require('./jsDecomment');
const path = require('path');
const fs = require('fs');

var OPTIONS = {
  build: 'build/index.js',
  output: 'index.js'
};


function updateMain(pth, o) {
  var pth = pth||'src/index.ts';
  var ext = path.extname(pth);
  var dec = pathReplaceExt(pth, '.d'+ext);
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateMain:', pth, o);
  execTsc(pth, o.tsc);
  execRollup(o.build, o.rollup);
  execDts(dec, o.dts);
  var js1 = o.output;
  var [dir, fil,] = pathSplit(js1);
  var mjs1 = path.join(dir, fil+'.mjs');
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(mjs1, 'utf8');
    fs.writeFileSync(mjs1, jsDecomment(d));
    var d = fs.readFileSync(js1, 'utf8');
    fs.writeFileSync(js1, jsDecomment(d));
  }
}
module.exports = updateMain;
