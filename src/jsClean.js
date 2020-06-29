const stripComments = require('strip-comments');
const {EOL} = require('os');


function jsClean(x, ln=false) {
  x = stripComments(x);
  x = x.replace(/\/\*\*.*?\*\//gs, '');
  x = x.replace(/\s+(\r?\n)/g, '$1');
  x = x.replace(/(\r?\n)\s*(\r?\n)+/g, ln? '$1':'$1$1');
  return x.trim()+EOL;
}
module.exports = jsClean;
