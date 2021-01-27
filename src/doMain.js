const execTsc = require('./execTsc');
const execRollup = require('./execRollup');
const execDts = require('./execDts');
const pathReplaceExt = require('./pathReplaceExt');
const jsUncomment = require('./jsUncomment');
const jsLinkWiki = require('./jsLinkWiki');
const fs = require('fs');

var OPTIONS = {
  build: 'build/index.js',
  out: 'index.js'
};


/**
 * Update main javascript file.
 * @param {string} ts path of main typescript file
 * @param {object} opt options
 */
function doMain(pth, opt) {
  var o = Object.assign({}, OPTIONS, opt);
  var ts = pth||'src/index.ts';
  var dts = pathReplaceExt(ts, '.d.ts');
  // var mjs = pathReplaceExt(o.output, '.mjs');
  // var dec = fs.existsSync(mjs)? mjs : dec;
  execTsc(ts, o.tsc);
  execRollup(o.build, o.rollup);
  execDts(dts, o.dts);
  var js1 = o.out;
  var mjs1 = pathReplaceExt(js1, '.mjs');
  var dts1 = pathReplaceExt(js1, '.d.ts');
  if(!fs.existsSync(dts1)) return;
  var d = fs.readFileSync(mjs1, 'utf8');
  fs.writeFileSync(mjs1, jsUncomment(d, true));
  var d = fs.readFileSync(js1, 'utf8');
  fs.writeFileSync(js1, jsUncomment(d, true));
  var d = fs.readFileSync(dts1, 'utf8');
  fs.writeFileSync(dts1, jsLinkWiki(d, o));
}
module.exports = doMain;
