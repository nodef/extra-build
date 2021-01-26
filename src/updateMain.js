const execTsc = require('./execTsc');
const execRollup = require('./execRollup');
const execDts = require('./execDts');
const pathSplit = require('./pathSplit');
const pathReplaceExt = require('./pathReplaceExt');
const jsClean = require('./jsUncomment');
const jsLinkWiki = require('./jsLinkWiki');
const kleur = require('kleur');
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
  console.log(kleur.bold().cyan('updateMain:'), pth);
  // var mjs = pathReplaceExt(o.output, '.mjs');
  // var dec = fs.existsSync(mjs)? mjs : dec;
  execTsc(pth, o.tsc);
  execRollup(o.build, o.rollup);
  execDts(dec, o.dts);
  var js1 = o.output;
  var [dir, fil] = pathSplit(js1);
  var mjs1 = path.join(dir, fil+'.mjs');
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(mjs1, 'utf8');
    fs.writeFileSync(mjs1, jsClean(d, true));
    var d = fs.readFileSync(js1, 'utf8');
    fs.writeFileSync(js1, jsClean(d, true));
    var d = fs.readFileSync(dts1, 'utf8');
    fs.writeFileSync(dts1, jsLinkWiki(d, o));
  }
  console.log();
}
module.exports = updateMain;
