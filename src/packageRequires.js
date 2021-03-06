const requireResolve = require('./requireResolve');
const fileRead = require('./fileRead');
const path = require('path');


// Gets requires from code.
function packageRequires(pth, a=new Set()) {
  var p = requireResolve(pth);
  if(a.has('./'+p)) return a;
  else a.add('./'+p);
  var d = fileRead(p);
  var re = /require\(\'(.*?)\'\)|^(?:import|export).*?from\s*\'(.*?)\';?$/gm, m = null;
  for(var reqs=[]; (m=re.exec(d))!=null;)
    reqs.push(m[1]||m[2]);
  var dir = path.dirname(pth);
  for(var p of reqs) {
    if(/^\./.test(p)) packageRequires(path.join(dir, p), a);
    else a.add(p);
  }
  return a;
}
module.exports = packageRequires;
