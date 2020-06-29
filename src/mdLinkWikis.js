const mdLinks = require('./mdLinks');
const mdSetHref = require('./mdSetHref');
const mdFilterHrefs = require('./mdFilterHrefs');
const wikiLink = require('./wikiLink');

const RWIKI = /github\.com.*?\/wiki\//;
var i = 0;

function mdLinkWikis(x, o) {
  var ls = mdLinks(x), ws = new Set();
  if(i===0) console.log(ws);
  x = mdFilterHrefs(x, (v, k) => {
    if(!ls.has(k)) return false;
    if(RWIKI.test(v)) {
      if(i===0) console.log(k, v);
      ws.add(k);
    }
    return true;
  });
  if(i===0) console.log(ws);
  i++;
  for(var k of ws)
    x = mdSetHref(x, k, wikiLink(k, o));
  return x;
}
module.exports = mdLinkWikis;
