const RLINK = /\[(.*?)\]/g;

function mdLinks(x, dir=false) {
  var a = new Set(), m = null;
  var x = x.replace(/```.*?```/gs, '');
  while((m=RLINK.exec(x))!=null) {
    var p = x[m.index-1], q = x[m.index+m[0].length];
    if(p==='!' || q===':') continue;
    if(q==='(' && !dir) continue;
    a.add(m[1]);
  }
  return a;
}
module.exports = mdLinks;
