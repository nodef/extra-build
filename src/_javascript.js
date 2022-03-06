const path = require('path');
const fs   = require('fs');




// STRING
// ------

/**
 * Get index of string end.
 * @param {string} txt javascript text
 * @param {number} i index of string begin
 */
function indexOfClosingString(txt, i) {
  var q = txt.charAt(i);
  while (true) {
    var I = txt.indexOf(q, i + 1);
    if (txt.charAt(I - 1) != '\\') return I;
    i = I + 1;
  }
}


/**
 * String match function.
 * @callback StringMatchFunction
 * @param {string} full full string
 */
/**
 * Match string in javascript text.
 * @param {string} txt javascript text
 * @param {StringMatchFunction} fn match function
 */
function forEachString(txt, fn) {
  var RCOMSTR = /\/\/|\/\*|['"`]/g, m = null;
  while ((m = RCOMSTR.exec(txt)) != null) {
    var i = m.index, I = 0;
    if (m[0] === '//')       I = txt.indexOf('\n', i + 1);
    else if (m[0] === '/**') I = txt.indexOf('*/', i + 1);
    else {
      I = indexOfClosingString(txt, i);
      fn(txt.substring(i, I + 1));
    }
    RCOMSTR.lastIndex = I + 1;
  }
}


/**
 * Get strings in javascript text.
 * @param {string} txt javascript text
 * @returns {string[]} strings
 */
function strings(txt) {
  var a = [];
  forEachCodeBlock(txt, full => a.push(full));
  return a;
}


/**
 * String replace function.
 * @callback StringReplaceFunction
 * @param {string} full full string
 * @returns {string} updated string
 */
/**
 * Replace strings in javascript text.
 * @param {string} txt javascript text
 * @param {StringReplaceFunction} fn replace function
 * @returns {string} updated javascript text
 */
function replaceStrings(txt, fn) {
  var RCOMSTR = /\/\/|\/\*|['"`]/g, m = null, a = '', ai = 0;
  while ((m = RCOMSTR.exec(txt)) != null) {
    var i = m.index, I = 0;
    if (m[0] === '//')      I = txt.indexOf('\n', i + 1);
    else if (m[0] === '/*') I = txt.indexOf('*/', i + 1);
    else {
      I  = indexOfClosingString(txt, i);
      a += txt.substring(ai, i) + fn(txt.substring(i, I + 1));
      ai = I + 1;
    }
    RCOMSTR.lastIndex = I + 1;
  }
  a += txt.substring(ai);
  return a;
}


/**
 * Tag strings in javascript text and remove them.
 * @param {string} txt javascript text
 * @returns {[string, Map<string, string>]} [updated javascript text, tags]
 */
function tagStrings(txt) {
  var tags = new Map(), i = -1;
  var txt  = replaceStrings(txt, full => {
    var k  = `AUTO_STRING_${++i}`;
    tags.set(k, full);
    return `"${k}"`;
  });
  return [txt, tags];
}


/**
 * Untag strings in javascript text by adding them back.
 * @param {string} txt javascript text
 * @param {Map<string, string>} tags tags
 * @returns {string} updated javascript text
 */
function untagStrings(txt, tags) {
  for (var [tag, full] of tags)
    txt = txt.replace(`"${tag}"`, full);
  return txt;
}




// COMMENT
// -------

/** Regex for comment. */
const RCOMMENT = /\/\/[\s\S]*?$|\/\*[\s\S]*?\*\//gm;


/**
 * Comment match function.
 * @callback CommentMatchFunction
 * @param {string} full full comment
 */
/**
 * Match links in javascript text.
 * @param {string} txt javascript text
 * @param {CommentMatchFunction} fn match function
 */
function forEachComment(txt, fn) {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"'), m = null;
  while ((m = RCOMMENT.exec(txt)) != null)
    fn(m[0]);
}


/**
 * Get comments in javascript text.
 * @param {string} txt javascript text
 * @returns {string[]} comments
 */
function comments(txt) {
  var a = [];
  forEachComment(txt, full => a.push(full));
  return a;
}


/**
 * Comment replace function.
 * @callback CommentReplaceFunction
 * @param {string} full full comment
 * @returns {string} updated comment
 */
/**
 * Replace comments in javascript text.
 * @param {string} txt javascript text
 * @param {CommentReplaceFunction} fn replace function
 * @returns {string} updated javascript text
 */
function replaceComments(txt, fn) {
  var [txt, tags] = tagStrings(txt);
  txt = txt.replace(RCOMMENT, fn);
  return untagStrings(txt, tags);
}


/**
 * Tag comments in javascript text and remove them.
 * @param {string} txt javascript text
 * @returns {[string, Map<string, string>]} [updated javascript text, tags]
 */
function tagComments(txt) {
  var tags = new Map(), i = -1;
  var txt  = replaceComments(txt, full => {
    var k  = `AUTO_COMMENT_${++i}`;
    tags.set(k, full);
    return `/* ${k} */`;
  });
  return [txt, tags];
}


/**
 * Untag comments in javascript text by adding them back.
 * @param {string} txt javascript text
 * @param {Map<string, string>} tags tags
 * @returns {string} updated javascript text
 */
function untagComments(txt, tags) {
  for (var [tag, full] of tags)
    txt = txt.replace(`/* ${tag} */`, full);
  return txt;
}


/**
 * Remove comments from javascript text.
 * @param {string} txt javascript text
 * @param {boolean} empty keep empty lines?
 */
function uncomment(txt, empty=false) {
  txt = replaceComments(txt, () => '').replace(/[ \t]+$/gm, '');
  if (empty) txt = txt.replace(/\n\n+/g, '\n');
  return txt.trim() + '\n';
}




// JSDOC-SYMBOL
// ------------

/** Regex for jsdoc and attached symbol: [jsdoc, export, default, kind, name]. */
const RJSDOCSYMBOL = /(\/\*\*[\s\S]*?\*\/)\s+(?:(export)\s+(?:(default)\s+)?)?(type|enum|interface|const|var|let|function\*?|class)\s+([\w$]+)/g;


/**
 * @callback JsdocSymbolMatchFunction
 * @param {string} full full jsdoc symbol match
 * @param {string} name symbol name
 * @param {string} kind symbol kind
 * @param {boolean} export symbol is exported?
 * @param {boolean} default symbol is default?
 * @param {string} jsdoc jsdoc attached to symbol
 */
/**
 * Match jsdoc symbols in javascript text.
 * @param {string} txt javascript text
 * @param {JsdocSymbolMatchFunction} fn match function
 */
function forEachJsdocSymbol(txt, fn) {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"'), m = null;
  while ((m = RJSDOCSYMBOL.exec(txt)) != null)
    fn(m[0], m[5] || '', m[4] || '', m[2] === 'export', m[3] === 'default', m[1] || '');
}


/**
 * @typedef JsdocSymbol
 * @prop {string} full full jsdoc symbol match
 * @prop {string} name symbol name
 * @prop {string} kind symbol kind
 * @prop {boolean} export symbol is exported?
 * @prop {boolean} default symbol is default?
 * @prop {string} jsdoc jsdoc attached to symbol
 */
/**
 * Get jsdoc symbols in javascript text.
 * @param {string} txt javascript text
 * @returns {JsdocSymbol[]} jsdoc symbols
 */
function jsdocSymbols(txt) {
  var a = [];
  forEachJsdocSymbol(txt, (full, name, kind, _export, _default, jsdoc) => {
    a.push({full, name, kind, export: _export, default: _default, jsdoc});
  });
  return a;
}


/**
 * Jsdoc symbol replace function.
 * @callback JsdocSymbolReplaceFunction
 * @prop {string} full full jsdoc symbol match
 * @prop {string} name symbol name
 * @prop {string} kind symbol kind
 * @prop {boolean} export symbol is exported?
 * @prop {boolean} default symbol is default?
 * @prop {string} jsdoc jsdoc attached to symbol
 * @returns {string} updated jsdoc symbol
 */
/**
 * Replace jsdoc symbols in javascript text.
 * @param {string} txt javascript text
 * @param {JsdocSymbolReplaceFunction} fn replace function
 * @returns {string} updated javascript text
 */
function replaceJsdocSymbols(txt, fn) {
  var [txt, tags] = tagStrings(txt);
  txt = txt.replace(RJSDOCSYMBOL, (m, p1, p2, p3, p4, p5) => {
    return fn(m, p5 || '', p4 || '', p2 === 'export', p3 === 'default', p1 || '');
  });
  return untagStrings(txt, tags);
}




// EXPORT-SYMBOL
// -------------

/** Regex for export symbol: [symbol1, symbol2, default1, kind, symbol3, default2, symbol4; symbol5, symbol6, module1, symbols?, module2]. */
const REXPORTSYMBOL = /export\s+\{\s*(?:(\S+)|(?:\S+\s+as\s+(\S+)))\s*\}|export\s+(?:(default)\s+)?(type|enum|interface|const|var|let|function\*?|class)\s+([\w$]+)|export\s+(default)\s+([\w$]+)|module\s*\.\s*([\w$]+)|module\s*\[\s*['"`](.*?)['"`]\s*\]|(module)\s*\.\s*exports\s*=\s*\{(.*?)\}|(module)\s*\.\s*exports\s*=/g;


/**
 * @callback ExportSymbolMatchFunction
 * @param {string} full full export symbol match
 * @param {string} name symbol name
 * @param {string} kind symbol kind
 * @param {boolean} default symbol is default?
 */
/**
 * Match export symbols in javascript text.
 * @param {string} txt javascript text
 * @param {ExportSymbolMatchFunction} fn match function
 */
function forEachExportSymbol(txt, fn) {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"');
  var txt = replaceComments(txt, () => `/* AUTO_COMMENT */`), m = null;
  while ((m = REXPORTSYMBOL.exec(txt)) != null)
    fn(m[0], m[11] || m[9] || m[8] || m[7] || m[5] || m[2] || m[1] || '', m[4] || '', (m[6] || m[3]) === 'default' || (m[12] || m[10]) === 'module');
}


/**
 * @typedef ExportSymbol
 * @prop {string} full full export symbol match
 * @prop {string} name symbol name
 * @prop {string} kind symbol kind
 * @prop {boolean} default symbol is default?
 */
/**
 * Get export symbols in javascript text.
 * @param {string} txt javascript text
 * @returns {ExportSymbol[]} export symbols
 */
function exportSymbols(txt) {
  var a = [];
  forEachExportSymbol(txt, (full, name, kind, _default) => {
    a.push({full, name, kind, default: _default});
  });
  return a;
}


/**
 * Export symbol replace function.
 * @callback ExportSymbolReplaceFunction
 * @param {string} full full export symbol match
 * @param {string} name symbol name
 * @param {string} kind symbol kind
 * @param {boolean} default symbol is default?
 * @returns {string} updated export symbol
 */
/**
 * Replace export symbols in javascript text.
 * @param {string} txt javascript text
 * @param {ExportSymbolReplaceFunction} fn replace function
 * @returns {string} updated javascript text
 */
function replaceExportSymbols(txt, fn) {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(REXPORTSYMBOL, (m, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) => {
    return fn(m, p11 || p9 || p8 || p7 || p5 || p2 || p1 || '', p4 || '', (p6 || p3) === 'default' || (p12 || p10) === 'module');
  });
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}




// IMPORT-SYMBOL
// -------------

/** Regex for import symbol: [file1, file2]. */
const RIMPORTSYMBOL = /(?:import|export).*?from\s*['"`](.*?)['"`]|require\s*\(\s*['"`](.*?)['"`]\s*\)/g;


/**
 * @callback ImportSymbolMatchFunction
 * @param {string} full full import symbol match
 * @param {string} file import file
 */
/**
 * Match import symbols in javascript text.
 * @param {string} txt javascript text
 * @param {ImportSymbolMatchFunction} fn match function
 */
function forEachImportSymbol(txt, fn) {
  var txt = replaceStrings(txt, () => '"AUTO_STRING"');
  var txt = replaceComments(txt, () => `/* AUTO_COMMENT */`), m = null;
  while ((m = RIMPORTSYMBOL.exec(txt)) != null)
    fn(m[0], m[2] || m[1] || '');
}


/**
 * @typedef ImportSymbol
 * @prop {string} full full import symbol match
 * @prop {string} file import file
 */
/**
 * Get import symbols in javascript text.
 * @param {string} txt javascript text
 * @returns {ImportSymbol[]} export symbols
 */
function importSymbols(txt) {
  var a = [];
  forEachImportSymbol(txt, (full, file) => a.push({full, file}));
  return a;
}


/**
 * Import symbol replace function.
 * @callback ImportSymbolReplaceFunction
 * @param {string} full full import symbol match
 * @param {string} file import file
 * @returns {string} updated import symbol
 */
/**
 * Replace import symbols in javascript text.
 * @param {string} txt javascript text
 * @param {ImportSymbolReplaceFunction} fn replace function
 * @returns {string} updated javascript text
 */
function replaceImportSymbols(txt, fn) {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(RIMPORTSYMBOL, (m, p1, p2) => fn(m, p2 || p1 || ''));
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}




// DECLARATION
// -----------

/**
 * Correct type declarations after generation.
 * @param {string} txt javascript text
 * @param {string} module module name
 * @returns {string} corrected javascript text
 */
function correctDeclarations(txt, module=null) {
  var [txt, stags] = tagStrings(txt);
  var [txt, ctags] = tagComments(txt);
  txt = txt.replace(/export\s+declare/g,   'export');
  txt = txt.replace(/export\s+default\s+/, 'export = ');
  txt = txt.replace(/declare\s+module\s+['"`](.*?)['"`]/g, (m, p1) => {
    return module != null? `declare module "${module}"` : m;
  });
  txt = untagComments(txt, ctags);
  txt = untagStrings(txt,  stags);
  return txt;
}
module.exports = {
  forEachString, strings, replaceStrings, tagStrings, untagStrings,
  forEachComment, comments, replaceComments, tagComments, untagComments, uncomment,
  forEachJsdocSymbol, jsdocSymbols, replaceJsdocSymbols,
  forEachExportSymbol, exportSymbols, replaceExportSymbols,
  forEachImportSymbol, importSymbols, replaceImportSymbols,
  correctDeclarations,
};
