// Preserve link brackets.
function mdReplace(x, y) {
  var links = new Set();
  var rref = /(.?)\[([\w\s\-$.]+)\](.?)/g, m = null;
  while((m=rref.exec(x))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  for(var l of links)
    y = y.replace(l, `[${l}]`);
  return y;
}
module.exports = mdReplace;
