const path = require('path');
const fs = require('fs');


// Get filename.
function requireResolve(p) {
  var ext = path.extname(p);
  if(/^\.(js|json|ts)$/.test(ext)) return p;
  if(fs.existsSync(p+'.js')) return p+'.js';
  if(fs.existsSync(p+'.json')) return p+'.json';
  if(fs.existsSync(p+'.ts')) return p+'.ts';
  return null;
}
module.exports = requireResolve;
