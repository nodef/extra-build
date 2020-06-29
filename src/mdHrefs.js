const RHREF = /\[(.*?)\]:\s+(\w+:\/\/[^\r\n]*)\r?\n/g;

function mdHrefs(x) {
  var a = new Map(), m = null;
  var x = x.replace(/```.*?```/gs, '');
  while((m=RHREF.exec(x))!=null)
    a.set(m[1], m[2]);
  return a;
}
module.exports = mdHrefs;
