const requireResolve = require('./requireResolve');
const fs = require('fs');
const path = require('path');


// Gets requires from code.
function packageRequires(pth, a=new Set()) {
  var p = requireResolve(pth); a.add('./'+p);
  var d = fs.readFileSync(p, 'utf8');
  var re = /require\(\'(.*?)\'\)|^(?:import|export).*?from\s*\'(.*?)\';?$/gm, m = null;
  for(var reqs=[]; (m=re.exec(d))!=null;)
    reqs.push(m[1]||m[2]);
  var dir = path.dirname(pth);
  for(var p of reqs) {
    if(/^\./.test(p) && !a.has(p)) packageRequires(path.join(dir, p), a);
    else a.add(p);
  }
  return a;
}
module.exports = packageRequires;
