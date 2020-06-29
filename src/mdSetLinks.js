const {EOL} = require('os');


function mdSetLinks(md, o) {
  var txt = md.replace(/```.*?```/gs, '');
  var links = new Map(), m = null;
  var rref = /(.?)\[([\(\)\w\-$:.]+)\](.?)/g;
  var rhref = /\[(.*?)\]:\s+(\w+:\/\/.*?)[\r\n]/g;
  var rwiki = /github\.com.*?\/wiki\//;
  var rlast = /(\r?\n)(\r?\n)+$|\[.*?\]:\s+.*?\n$/;
  // find references (indirect links)
  while((m=rref.exec(txt))!=null) {
    if(m[1]==='!' || m[3]==='(') continue;
    links.set(m[2], `https://github.com/${o.org}/${o.package_root}/wiki/${m[2]}`);
  }
  // clean old hrefs
  md = md.replace(rhref, (m, p1, p2) => {
    var ok = links.has(p1) && !rwiki.test(p2) || links.get(p1)===p2;
    if(ok) { links.delete(p1); return m; }
    console.log('mdSetLinks: clean', p1, p2); return '';
  });
  // add new hrefs
  if(!rlast.test(md)) md += EOL;
  for(var [k, v] of links) {
    console.log('mdSetLinks: add', k, v);
    md += `[${k}]: ${v}`+EOL;
  }
  return md;
}
module.exports = mdSetLinks;
