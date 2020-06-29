const stripComments = require('strip-comments');
const {EOL} = require('os');


function jsClean(x, ln=false) {
  x = stripComments(x);
  // x = x.replace(/\s+(\r?\n)/g, EOL);
  x = x.replace(/\/\*\*.*?\*\//gs, '');
  x = x.replace(/(\r?\n)\s*(\r?\n)+/g, ln? EOL:EOL+EOL);
  return x.trim()+EOL;
}
module.exports = jsClean;
