const RLINK = /(.?)\[(.*?)\](?!:)(\(.*?\))?/g;


/**
 * Get link names in markdown.
 * @param {string} md markdown data
 * @param {boolean} dir include direct link?
 */
function mdLinks(md, dir=false) {
  var a = new Map(), m = null;
  var md = md.replace(/```.*?```/gs, '');
  while((m=RLINK.exec(md))!=null) {
    if(m[1]==='!') continue;
    if(m[3]!=null && !dir) continue;
    a.set(m[2], m[3]? m[3].slice(1, -1) : null);
  }
  return a;
}
module.exports = mdLinks;
