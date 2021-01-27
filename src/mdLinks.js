const RLINK = /(.?)\[(.*?)\](.?)/g;


/**
 * Get link names in markdown.
 * @param {string} md markdown data
 * @param {boolean} dir ??
 */
function mdLinks(md, dir=false) {
  var a = new Set(), m = null;
  var md = md.replace(/```.*?```/gs, '');
  while((m=RLINK.exec(md))!=null) {
    if(m[1]==='!') continue;
    if(m[3]==='(' && !dir) continue;
    a.add(m[2]);
  }
  return a;
}
module.exports = mdLinks;
