const dirExport = require('./dirExport');
const fileRead = require('./fileRead');
const exportSymbols = require('./exportSymbols');
const exportCustom = require('./exportCustom');
const pathReplaceExt = require('./pathReplaceExt');
const path = require('path');
const fs = require('fs');


/**
 * Updates export file, with missing declarations.
 * @param {string} pth path of main typescipt file (src/index.ts)
 */
function updateExport(pth) {
  var ts = pth||'src/index.ts';
  var dts = pathReplaceExt(ts, '.d.ts');
  var dir = path.dirname(ts);
  var d = exportCustom(fileRead(ts));
  var custom = exportSymbols(d);
  fs.writeFileSync(ts, d + dirExport(dir, custom));
  fs.writeFileSync(dts, dirExport(dir));
}
module.exports = updateExport;
