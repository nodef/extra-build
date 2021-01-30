const console = require('./console');
const dirExport = require('./dirExport');
const fileRead = require('./fileRead');
const exportSymbols = require('./exportSymbols');
const exportCustom = require('./exportCustom');
const pathReplaceExt = require('./pathReplaceExt');
const path = require('path');
const fs = require('fs');


/**
 * Generate export file with declarations.
 * @param {string} pth path of export file (src/index.ts)
 */
function doExport(pth) {
  var ts = pth||'src/index.ts';
  console.log(`Generating exports at ${ts} ...`);
  var dts = pathReplaceExt(ts, '.d.ts');
  var dir = path.dirname(ts);
  var d = exportCustom(fileRead(ts));
  var custom = exportSymbols(d);
  fs.writeFileSync(ts, d+dirExport(dir, custom));
  fs.writeFileSync(dts, dirExport(dir));
}
module.exports = doExport;
