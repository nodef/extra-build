const stripComments = require('strip-comments');
const {EOL} = require('os');


function jsClean(x, ln=false) {
  x = stripComments(x);
  x = x.replace(/\/\*\*.*?\*\//gs, '');
  x = x.replace(/\s+(\r?\n)/g, '$1');
  if(ln) x = x.replace(/(\r?\n)\s*(\r?\n)+/g, '$1$2');
  return x.trim()+EOL;
}
module.exports = jsClean;
