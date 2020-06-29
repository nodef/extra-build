const RLINK = /(.?)\[(.*?)\](.?)/g;

function mdLinks(x, dir=false) {
  var a = new Set(), m = null;
  var x = x.replace(/```.*?```/gs, '');
  while((m=RLINK.exec(x))!=null) {
    console.log(m.slice(1, 4));
    if(m[1]==='!' || m[3]===':') continue;
    if(m[3]==='(' && !dir) continue;
    a.add(m[2]);
  }
  return a;
}
module.exports = mdLinks;
