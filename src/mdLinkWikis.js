const mdLinks = require('./mdLinks');
const mdSetHref = require('./mdSetHref');
const mdFilterHrefs = require('./mdFilterHrefs');
const wikiLink = require('./wikiLink');

const RWIKI = /github\.com.*?\/wiki\//;

function mdLinkWikis(md, o) {
  var ls = mdLinks(md);
  md = mdFilterHrefs(md, (v, k) => {
    if(!ls.has(k)) return false;
    if(!RWIKI.test(v)) ls.delete(k);
    return true;
  });
  for(var k of ls)
    md = mdSetHref(x, k, wikiLink(k, o));
  return md;
}
module.exports = mdLinkWikis;
