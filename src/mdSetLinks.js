const {EOL} = require('os');


function mdSetLinks(md, o) {
  var txt = md.replace(/```.*?```/gs, '');
  var links = new Set();
  var rref = /(.?)\[([\w\-$.]+)\](.?)/g, m = null;
  var rlink = /^\[([\w\-$.]+)\]\s*:\s*(.*?)$/gm, m = null;
  while((m=rref.exec(txt))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  while((m=rlink.exec(txt))!=null)
    links.delete(m[1]);
  for(var l of links) {
    console.log('mdSetLinks: '+l);
    md = md+`[${l}]: https://github.com/${o.org}/${o.package_root}/wiki/${l}`+EOL;
  }
  return md;
}
module.exports = mdSetLinks;
