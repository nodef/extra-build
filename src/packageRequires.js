const requireResolve = require('./requireResolve');
const fs = require('fs');
const path = require('path');


// Gets requires from code.
function packageRequires(pth, a=[]) {
  var d = fs.readFileSync(requireResolve(pth), 'utf8');
  var re = re = /require\(\'(.*?)\'\)/g;
  for(var m=null, reqs=[]; (m=re.exec(d))!=null;)
  { reqs.push(m[1]); a.push(m[1]); }
  if(reqs.length===0) return a;
  var dir = path.dirname(pth);
  for(var p of reqs)
    if(/^\./.test(p)) packageRequires(path.join(dir, p), a);
  return a;
}
module.exports = packageRequires;
