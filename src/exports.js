const console = require('./_console');
const path    = require('./_path');
const fs      = require('./_fs');




/**
 * Remove auto-generated exports from javascript text.
 * @param {string} txt javascript text
 * @returns {string} set of custom symbols
 */
function removeAuto(txt) {
  var RAUTO = /^.*\/\/.*\bAUTO-EXPORT\b.*$/gm;
  return txt.replace(RAUTO, '');
}


/**
 * Get all export symbols from javascript text.
 * @param {string} txt javascript text
 * @returns {Set<string>} set of symbols
 */
function symbols(txt) {
  var REXPORT = /export\s+\{\s*(?:(\S+)|(?:\S+\s+as\s+(\S+)))\s*\}|export\s+(?:type|enum|interface|const|var|let|function\*?|class)\s+([\w$]+)|export\s+(default)\s+(?:[\w$]+)/g;
  var a = new Set(), m = null;
  while ((m = REXPORT.exec(txt)) != null)
    a.add(m[4]||m[3]||m[2]||m[1]);
  return a;
}


/**
 * Get custom export symbols from javascript text.
 * @param {string} txt javascript text
 * @returns {Set<string>} set of custom symbols
 */
function customSymbols(txt) {
  return symbols(removeAuto(txt));
}


/**
 * Get auto export statement for file.
 * @param {string} sym symbol name
 * @param {string} pth file path
 * @param {boolean} def has default export?
 */
function statement(sym, pth, def=false) {
  var exp = def? `{default as ${sym}}` : `* as ${sym}`;
  return `export ${exp} from "./${pth}"; // AUTO-EXPORT`;
}


/**
 * Get auto exports for a given directory.
 * @param {string} dir source directory [src]
 * @returns {Set<string>} set of symbols to exclude
 */
function fromDir(dir='src', exc=new Set()) {
  var a = '';
  for (var f of fs.readdir(dir)) {
    var fil = path.filename(f);
    var sym = path.symbolname(f);
    if (exc.has(sym)) continue;
    var txt = fs.read(path.join(dir, f));
    var s   = symbols(txt);
    a += statement(sym, fil, s.has('default')) + '\n';
  }
}


/**
 * Generate exports file.
 * @param {string} src source directory
 * @param {string} out output exports file
 */
function generate(src='src', out='src/index.ts') {
  console.log(`Generating exports from ${src} at ${out} ...`);
  var txt = fs.read(out);
  var rem = removeAuto(txt);
  var exc = customSymbols(txt);
  var exp = fromDir(dir, exc);
  fs.write(out, exp);
  console.info(`Exports: ${[...symbols(exp)]}`);
}
module.exports = {removeAuto, symbols, customSymbols, statement, generate};
