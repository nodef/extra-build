const console = require('./console');
const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const fileName = require('./fileName');
const pathReplaceExt = require('./pathReplaceExt');
const jsUncomment = require('./jsUncomment');
const jsLinkWiki = require('./jsLinkWiki');
const execTsc = require('./execTsc');
const execRollup = require('./execRollup');
const execDts = require('./execDts');
const fs = require('fs');


/**
 * Generate main javascript file.
 * @param {string} ts path of main typescript file
 * @param {object} o options
 */
function doMain(pth, o) {
  var isSub = o.name !== o.nameRoot;
  var ts = pth||'src/index.ts';
  var dts = pathReplaceExt(ts, '.d.ts');
  dts = fs.existsSync(dts)? dts : ts;
  var f = fileName(ts);
  // var mjs = pathReplaceExt(o.output, '.mjs');
  // var dec = fs.existsSync(mjs)? mjs : dec;
  console.log(`Generating main files ...`);
  if (isSub) cpExec(`cp "${o.buildDir}/${f}.d.ts" "${o.outDts}"`);
  if (!isSub) execTsc(ts, o);
  execRollup(o.build, o);
  if (!isSub) execDts(dts, o);
  // Update files
  if(!fs.existsSync(o.outDts)) return;
  var d = fileRead(o.outEs);
  fileWrite(o.outEs, jsUncomment(d, true));
  var d = fileRead(o.outJs);
  fileWrite(o.outJs, jsUncomment(d, true));
  var d = fileRead(o.outDts);
  fileWrite(o.outDts, jsLinkWiki(d, o));
}
module.exports = doMain;
