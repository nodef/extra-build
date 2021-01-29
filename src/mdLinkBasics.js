const mdAsciinema = require('./mdAsciinema');
const mdSetHref = require('./mdSetHref');
const mdHrefs = require('./mdHrefs');
const urlRunkit = require('./urlRunkit');
const urlPackage = require('./urlPackage');
const urlPackageMin = require('./urlPackageMin');
const urlUnpkg = require('./urlUnpkg');
const urlJsdoc = require('./urlJsdoc');
const urlWiki = require('./urlWiki');
const mdLinks = require('./mdLinks');
const eolSet = require('./eolSet');

const PKG = ':package:';
const GIT = ':smiley_cat:';
const RUN = ':running:';
const CIN = ':vhs:';
const MIN = ':moon:';
const LST = ':scroll:';
const DOC = ':newspaper:';
const WIK = ':blue_book:';
const NAMES = new Map([
  [PKG, 'NPM'],
  [GIT, 'GitHub'],
  [RUN, 'RunKit'],
  [CIN, 'Asciinema'],
  [MIN, 'Minified'],
  [LST, 'Files'],
  [DOC, 'JSDoc'],
  [WIK, 'Wiki']
]);


/**
 * Add basic links to markdown.
 * @param {string} md markdown data
 * @param {object} o options
 */
function mdLinkBasics(md, o) {
  md = eolSet(md, '\n');
  var hs = new Map([...mdLinks(md, true), ...mdHrefs(md)]);
  hs.set(PKG, urlPackage(o));
  hs.set(GIT, urlPackage(o));
  hs.set(RUN, urlRunkit(o));
  hs.set(MIN, urlPackageMin(o));
  hs.set(LST, urlUnpkg(o));
  hs.set(DOC, urlJsdoc(o));
  hs.set(WIK, urlWiki('', o));
  if(o.diffCodeBlocks) hs.delete(CIN);
  if(o.asciinema) hs.set(CIN, hs.get(CIN)||hs.get(NAMES.get(CIN))||mdAsciinema(md, o));
  var ls = new Set([...NAMES.keys()]);
  if (!o.asciinema) ls.delete(CIN);
  if (!o.headerHeavy) return eolSet(linkLight(md, [...ls], hs));
  return eolSet(linkHeavy(md, [...ls], NAMES, hs))
}


function linkLight(md, ls, hs) {
  var lnks = ls.map(l => `[${l}]`).join(' ');
  md = md.replace(/^([^:]+\.)[\s\S]*?\n\n/, '$1 '+lnks+'\n\n');
  for (var l of ls)
    md = mdSetHref(md, l, hs.get(l));
  return md;
}

function linkHeavy(md, ls, ns, hs) {
  var lnks = ls.map(l => `${l} [${ns.get(l)}](${hs.get(l)})`).join(',\n');
  for (var l of ls)
    md = mdSetHref(md, l, null);
  md = md.replace(/^([^:]+\.)[\s\S]*?\n\n|^([^:]+\.)\n\n/, '$1$2<br>'+'\n'+lnks+'.\n\n');
  return md;
}
module.exports = mdLinkBasics;
