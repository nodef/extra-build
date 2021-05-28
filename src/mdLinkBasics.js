const mdAsciinema = require('./mdAsciinema');
const mdSetHref = require('./mdSetHref');
const mdHrefs = require('./mdHrefs');
const urlRunkit = require('./urlRunkit');
const urlPackage = require('./urlPackage');
const urlGithub = require('./urlGithub');
const urlPackageMin = require('./urlPackageMin');
const urlUnpkg = require('./urlUnpkg');
const urlJsdoc = require('./urlJsdoc');
const urlWiki = require('./urlWiki');
const mdLinks = require('./mdLinks');

const PKG = '📦';
const GIT = '😺';
const RUN = '🏃';
const CIN = '📼';
const MIN = '🌔';
const LST = '📜';
const DOC = '📰';
const WIK = '📘';
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
const HEADERS = ['light', 'heavy'];
const RHEADER = /^([^:`]+\.)[\s\S]*?\n\n/;


/**
 * Add basic links to markdown.
 * @param {string} md markdown data
 * @param {string} hdr header type
 * @param {object} o options
 */
function mdLinkBasics(md, hdr, o) {
  if (!HEADERS.includes(hdr)) return md;
  var hs = new Map([...mdLinks(md, true), ...mdHrefs(md)]);
  if(o.diffCodeBlocks) hs.delete(CIN);
  hs.set(PKG, urlPackage(o));
  hs.set(GIT, urlGithub(o));
  hs.set(RUN, urlRunkit(o));
  hs.set(MIN, urlPackageMin(o));
  hs.set(LST, urlUnpkg(o));
  hs.set(DOC, urlJsdoc(o));
  hs.set(WIK, urlWiki('', o));
  hs.set(CIN, hs.get(CIN)||hs.get(NAMES.get(CIN)));
  if (o.asciinema) hs.set(CIN, hs.get(CIN)||mdAsciinema(md, o));
  else hs.delete(CIN);
  var ls = new Set([...NAMES.keys()]);
  if (!hs.has(CIN)) ls.delete(CIN);
  var fn = hdr === 'heavy'? headerHeavy : headerLight;
  return fn(md, [...ls], hs).trim()+'\n';
}


function headerLight(md, ls, hs) {
  var lnks = ls.map(l => `[${l}](${hs.get(l)})`).join('\n');
  for (var l of ls) md = mdSetHref(md, l, null);
  md = md.replace(RHEADER, '$1\n'+lnks+'\n\n');
  return md;
}

function headerHeavy(md, ls, hs) {
  var lnks = ls.map(l => `${l} [${NAMES.get(l)}](${hs.get(l)})`).join(',\n');
  for (var l of ls) md = mdSetHref(md, l, null);
  md = md.replace(RHEADER, '$1<br>\n'+lnks+'.\n\n');
  return md;
}
module.exports = mdLinkBasics;
