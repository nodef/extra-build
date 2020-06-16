// Gets exported symbols.
function jsExports(d) {
  var a = new Set(), m = null;
  var rjs = /exports\.(\S+)\s*=/g;
  var res = /export\s+\{\s*[(\S+)(?:\S+\s+as\s+(\S+))]\s*\}/g;
  while((m=rjs.exec(d))!=null) a.add(m[1]);
  while((m=res.exec(d))!=null) a.add(m[1]);
  return a;
}
module.exports = jsExports;
