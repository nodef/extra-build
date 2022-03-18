// CODE-BLOCK
// ----------

/** Regex for code block: [language, fenced-body, indented-body]. */
const RCODEBLOCK = /^ {0,3}```(\w*)\s*\n([\s\S]*?)^ {0,3}```[ \t]*\n|((?:^(?: {4}|\t)[\s\S]*?\n)+)/gm;


/**
 * Unindent code block with 4 spaces or a tab.
 * @param {string} txt code block
 * @returns {string} unindented code block
 */
function unindentCodeBlock(txt) {
  return txt.replace(/^( {4}|\t)/gm, '');
}


/**
 * Code block match function.
 * @callback CodeBlockMatchFunction
 * @param {string} full full code block
 * @param {string} lang code block language
 * @param {string} body code block body
 */
/**
 * Match code blocks in markdown text.
 * @param {string} txt markdown text
 * @param {CodeBlockMatchFunction} fn match function
 */
function forEachCodeBlock(txt, fn) {
  var m = null;
  while ((m = RCODEBLOCK.exec(txt)) != null)
    fn(m[0], m[1] || '', m[2] != null? m[2] : unindentCodeBlock(m[3]));
}


/**
 * @typedef CodeBlock
 * @prop {string} full full code block
 * @prop {string} language code block language
 * @prop {string} body code block body
 */
/**
 * Get code blocks in markdown text.
 * @param {string} txt markdown text
 * @returns {CodeBlock[]} code blocks
 */
function codeBlocks(txt) {
  var a = [];
  forEachCodeBlock(txt, (full, language, body) => a.push({full, language, body}));
  return a;
}


/**
 * Code block replace function.
 * @callback CodeBlockReplaceFunction
 * @param {string} full full code block
 * @param {string} lang code block language
 * @param {string} body code block body
 * @returns {string} updated code block
 */
/**
 * Replace code blocks in markdown text.
 * @param {string} txt markdown text
 * @param {CodeBlockReplaceFunction} fn replace function
 * @returns {string} updated markdown text
 */
function replaceCodeBlocks(txt, fn) {
  return txt.replace(RCODEBLOCK, (m, p1, p2, p3) => {
    return fn(m, p1 || '', p2 != null? p2 : unindentCodeBlock(p3));
  });
}


/**
 * Tag code blocks in markdown text and remove them.
 * @param {string} txt markdown text
 * @returns {[string, Map<string, string>]} [updated markdown text, tags]
 */
function tagCodeBlocks(txt) {
  var tags = new Map(), i = -1;
  var txt  = replaceCodeBlocks(txt, full => {
    var k  = `AUTO_CODE_BLOCK_${++i}`;
    tags.set(k, full);
    return '```\n' + `${k}\n` + '```\n';
  });
  return [txt, tags];
}


/**
 * Untag code blocks in markdown text by adding them back.
 * @param {string} txt markdown text
 * @param {Map<string, string>} tags tags
 * @returns {string} updated markdown text
 */
function untagCodeBlocks(txt, tags) {
  for (var [tag, full] of tags)
    txt = txt.replace('```\n' + `${tag}\n` + '```\n', full);
  return txt;
}




// LINK
// ----

/** Regex for link: [name, url, reference]. */
const RLINK = /!?\[(.*?)\](?:\((.*?)\)| ?\[(.*?)\]|(?!:))/gm;


/**
 * Link match function.
 * @callback LinkMatchFunction
 * @param {string} full full link
 * @param {string} name link name
 * @param {string} ref link reference
 * @param {string} url link url
 */
/**
 * Match links in markdown text.
 * @param {string} txt markdown text
 * @param {LinkMatchFunction} fn match function
 */
function forEachLink(txt, fn) {
  var txt = replaceCodeBlocks(txt, () => ''), m = null;
  while ((m = RLINK.exec(txt)) != null)
    if (!m[0].startsWith('!')) fn(m[0], m[1], m[3] || '', m[2] || '');
}


/**
 * @typedef Link
 * @prop {string} full full link
 * @prop {string} name link name
 * @prop {string} reference link reference
 * @prop {string} url link url
 */
/**
 * Get links in markdown text.
 * @param {string} txt markdown text
 * @returns {Link[]} links
 */
function links(txt) {
  var a = [];
  forEachLink(txt, (full, name, reference, url) => a.push({full, name, reference, url}));
  return a;
}


/**
 * Link replace function.
 * @callback LinkReplaceFunction
 * @param {string} full full link
 * @param {string} name link name
 * @param {string} ref link reference
 * @param {string} url link url
 * @returns {string} updated link
 */
/**
 * Replace links in markdown text.
 * @param {string} txt markdown text
 * @param {LinkReplaceFunction} fn replace function
 * @returns {string} updated markdown text
 */
function replaceLinks(txt, fn) {
  var [txt, tags] = tagCodeBlocks(txt);
  txt = txt.replace(RLINK, (m, p1, p2, p3) => {
    return m.startsWith('!')? m : fn(m, p1, p3 || '', p2 || '');
  });
  return untagCodeBlocks(txt, tags);
}




// LINK-REFERENCE
// --------------

/** Regex for link references: [name, url, title]. */
const RLINKREFERENCE = /^[ \t]*\[(.*?)\]:[ \t]*<?([>\S]*?)>?(?:[ \t]*['"(](.*?)['")])?[ \t]*$/gm;


/**
 * Link reference match function.
 * @callback LinkReferenceMatchFunction
 * @param {string} full full link reference
 * @param {string} name link reference name
 * @param {string} url link reference url
 * @param {string} title link reference title
 */
/**
 * Match link references in markdown text.
 * @param {string} txt markdown text
 * @param {LinkReferenceMatchFunction} fn match function
 */
function forEachLinkReference(txt, fn) {
  var txt = replaceCodeBlocks(txt, () => ''), m = null;
  while ((m = RLINKREFERENCE.exec(txt)) != null)
    fn(m[0], m[1], m[2], m[3] || '');
}


/**
 * @typedef LinkReference
 * @prop {string} full full link reference
 * @prop {string} name link reference name
 * @prop {string} url link reference url
 * @prop {string} title link reference title
 */
/**
 * Get link references in markdown text.
 * @param {string} txt markdown text
 * @returns {LinkReference[]} links
 */
function linkReferences(txt) {
  var a = [];
  forEachLinkReference(txt, (full, name, url, title) => a.push({full, name, url, title}));
  return a;
}


/**
 * Link reference replace function.
 * @callback LinkReferenceReplaceFunction
 * @param {string} full full link reference
 * @param {string} name link reference name
 * @param {string} url link reference url
 * @param {string} title link reference title
 * @returns {string} updated link reference
 */
/**
 * Replace link references in markdown text.
 * @param {string} txt markdown text
 * @param {LinkReplaceFunction} fn replace function
 * @returns {string} updated markdown text
 */
function replaceLinkReferences(txt, fn) {
  var [txt, tags] = tagCodeBlocks(txt);
  txt = txt.replace(RLINKREFERENCE, (m, p1, p2, p3) => fn(m, p1, p2, p3 || ''));
  return untagCodeBlocks(txt, tags);
}




// TABLE
// -----

/** Regex for table. */
const RTABLE = /.*?\n.*?(?:\|[ \t]*---|---[ \t]*\|)[\s\S]*?(?:\n(?=[ \t]*\n)|$)/g;


/**
 * Get table rows from full table.
 * @param {string} full full table
 * @returns {string[][]} table rows
 */
function tableRows(full) {
  var rows = [];
  var ls = full.trim().split('\n');
  ls.splice(1, 1);
  for (var l of ls)
    rows.push(l.replace(/(^\s*\|)|(\|\s*$)/g, '').split('|'));
  return rows;
}


/**
 * Table match function.
 * @callback TableMatchFunction
 * @param {string} full full table
 * @param {string[][]} rows all rows of table
 */
/**
 * Match tables in markdown text.
 * @param {string} txt markdown text
 * @param {TableMatchFunction} fn match function
 */
function forEachTable(txt, fn) {
  var txt = replaceCodeBlocks(txt, () => ''), m = null;
  while ((m = RTABLE.exec(txt)) != null)
    fn(m[0], tableRows(m[0]));
}


/**
 * @typedef Table
 * @prop {string} full full table
 * @prop {string[][]} rows rows of table
 */
/**
 * Get tables in markdown text.
 * @param {string} txt markdown text
 * @returns {Table[]} tables
 */
function tables(txt) {
  var a = [];
  forEachTable(txt, (full, rows) => a.push({full, rows}));
  return a;
}


/**
 * Table replace function.
 * @callback TableReplaceFunction
 * @param {string} full full table
 * @param {string[][]} rows all rows of table
 */
/**
 * Replace tables in markdown text.
 * @param {string} txt markdown text
 * @param {TableReplaceFunction} fn replace function
 * @returns {string} updated markdown text
 */
function replaceTables(txt, fn) {
  var [txt, tags] = tagCodeBlocks(txt);
  txt = txt.replace(RTABLE, m => fn(m, tableRows(m)));
  return untagCodeBlocks(txt, tags);
}
module.exports = {
  forEachCodeBlock, codeBlocks, replaceCodeBlocks, tagCodeBlocks, untagCodeBlocks,
  forEachLink, links, replaceLinks,
  forEachLinkReference, linkReferences, replaceLinkReferences,
  forEachTable, tables, replaceTables,
};
