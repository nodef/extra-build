const mdLinks = require('./mdLinks');
const mdSetHref = require('./mdSetHref');
const mdFilterHref = require('./mdFilterHref');
const urlWiki = require('./urlWiki');

const RWIKI = /github\.com.*?\/wiki\/.+/;


function mdLinkWikis(md, o) {
  var ls = mdLinks(md), ws = new Set();
  md = mdFilterHref(md, (v, k) => {
    console.log({k, v});
    if(!ls.delete(k)) return false;
    if(RWIKI.test(v)) ws.add(k);
    return true;
  });
  // If link was not specified
  for (var k of ls.keys()) ws.add(k);
  // If link was wrong
  for (var k of ws)
    md = mdSetHref(md, k, urlWiki(k, o));
  return md;
}
module.exports = mdLinkWikis;
