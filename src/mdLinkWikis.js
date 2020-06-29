const mdLinks = require('./mdLinks');
const mdSetHref = require('./mdSetHref');
const mdFilterHrefs = require('./mdFilterHrefs');
const wikiLink = require('./wikiLink');

const RWIKI = /github\.com.*?\/wiki\//;

function mdLinkWikis(x, o) {
  var ls = mdLinks(x);
  x = mdFilterHrefs(x, (v, k) => {
    if(!ls.has(k)) return false;
    if(!RWIKI.test(v)) ls.delete(k);
    return true;
  });
  for(var k of ls)
    x = mdSetHref(x, k, wikiLink(k, o));
  return x;
}
module.exports = mdLinkWikis;