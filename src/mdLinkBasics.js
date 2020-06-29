const mdAsciinema = require('./mdAsciinema');
const mdSetHref = require('./mdSetHref');
const mdHrefs = require('./mdHrefs');
const {EOL} = require('os');

const RUN = ':running:';
const CIN = ':vhs:';
const PKG = ':package:';
const MIN = ':moon:';
const LST = ':ledger:';

function mdLinkBasics(md, o) {
  var p = o.package||o.package_root, hs = mdHrefs(md);
  if(o.diff_code_blocks) hs.delete(CIN);
  if(o.asciinema) hs.set(CIN, hs.get(CIN)||mdAsciinema(md, o));
  var lnk = [RUN, ...(o.asciinema? [CIN]:[]), PKG, MIN, LST];
  md = md.replace(/^([^\.\r\n]*\.?).*?\r?\n/, '$1 '+lnk.map(l => `[${l}]`).join(' ')+EOL);
  md = mdSetHref(md, RUN, `https://npm.runkit.com/${p}`);
  if(o.asciinema) md = mdSetHref(md, CIN, hs.get(CIN));
  md = mdSetHref(md, PKG, `https://www.npmjs.com/package/${p}`);
  md = mdSetHref(md, MIN, `https://www.npmjs.com/package/${p}.min`);
  md = mdSetHref(md, LST, `https://unpkg.com/${p}/`);
  return md;
}
module.exports = mdLinkBasics;
