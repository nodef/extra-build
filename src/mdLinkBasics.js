const mdAsciinema = require('./mdAsciinema');
const mdSetHref = require('./mdSetHref');
const mdHrefs = require('./mdHrefs');
const urlRunkit = require('./urlRunkit');
const urlPackage = require('./urlPackage');
const urlPackageMin = require('./urlPackageMin');
const urlUnpkg = require('./urlUnpkg');
const urlJsdoc = require('./urlJsdoc');
const urlWiki = require('./urlWiki');
const {EOL} = require('os');

const RUN = ':running:';
const CIN = ':vhs:';
const PKG = ':package:';
const MIN = ':moon:';
const LST = ':ledger:';
const DOC = ':newspaper:';
const WIK = ':blue_book:';


/**
 * Add basic links to markdown.
 * @param {string} md markdown data
 * @param {object} o options
 */
function mdLinkBasics(md, o) {
  var hs = mdHrefs(md);
  if(o.diffCodeBlocks) hs.delete(CIN);
  if(o.asciinema) hs.set(CIN, hs.get(CIN)||mdAsciinema(md, o));
  var lnk = [RUN, ...(o.asciinema? [CIN]:[]), PKG, MIN, LST, DOC, WIK];
  md = md.replace(/^([^\.\r\n]*\.?).*?\r?\n/, '$1 '+lnk.map(l => `[${l}]`).join(' ')+EOL);
  md = mdSetHref(md, RUN, urlRunkit(o));
  if(o.asciinema) md = mdSetHref(md, CIN, hs.get(CIN));
  md = mdSetHref(md, PKG, urlPackage(o));
  md = mdSetHref(md, MIN, urlPackageMin(o));
  md = mdSetHref(md, LST, urlUnpkg(o));
  md = mdSetHref(md, DOC, urlJsdoc(o));
  md = mdSetHref(md, WIK, urlWiki('', o));
  return md;
}
module.exports = mdLinkBasics;
