// Defines exports for symbol.
function jsExportsDefine(sym, pth, fmt='es') {
  if(fmt==='es') return `export {default as ${sym}} from './${pth}';`;
  return `exports.${sym} = require('./${pth}');`;
}
module.exports = jsExportsDefine;
