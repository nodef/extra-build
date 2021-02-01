const dirFiles = require('./dirFiles');
const fileName = require('./fileName');
const fileSymbol = require('./fileSymbol');


/**
 * Get exports for a directory.
 * @param {string} dir directory path
 * @param {Set} exc exception list
 */
function dirExport(dir, exc=new Set()) {
  var a = '';
  for(var f of dirFiles(dir)) {
    var fil = fileName(f);
    var sym = fileSymbol(f);
    if(exc.has(sym)) continue;
    a += `export {default as ${sym}} from './${fil}';\n`;
  }
  return a;
}
module.exports = dirExport;
