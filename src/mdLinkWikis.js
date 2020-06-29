const mdLinks = require('./mdLinks');
const mdSetHref = require('./mdSetHref');
const mdFilterHrefs = require('./mdFilterHrefs');
const wikiLink = require('./wikiLink');

const RWIKI = /github\.com.*?\/wiki\//;

function mdLinkWikis(x, o) {
  var ls = mdLinks(x), ws = new Set();
  x = mdFilterHrefs(x, (v, k) => {
    if(!ls.has(k)) return false;
    if(RWIKI.test(v)) ws.add(ws);
    return true;
  });
  for(var k of ws)
    x = mdSetHref(x, k, wikiLink(k, o));
  return x;
}
module.exports = mdLinkWikis;
