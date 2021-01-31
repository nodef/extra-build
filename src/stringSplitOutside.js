const RSEP = /,\s*/;
const ROPEN = /[\(\[\{<]/;
const RCLOSE = /[\)\]\}>]/;


function stringSplitOutside(x, rsep=RSEP, ropen=ROPEN, rclose=RCLOSE) {
  var a = [], j = 0, b = 0;
  for (var i=0; i<x.length;) {
    var xi = x.substring(i);
    var mo = ropen.exec(xi);
    var mc = rclose.exec(xi);
    var ms = rsep.exec(xi);
    if (mo && mo.index === 0) { b++; i += mo[0].length; }
    else if (mc && mc.index === 0) { b--; i += mc[0].length; }
    else if (ms && ms.index === 0 && b === 0) {
      a.push(x.substring(j, i));
      i += ms[0].length; j = i;
    }
    else i++;
  }
  a.push(x.substring(j));
  return a;
}
module.exports = stringSplitOutside;
