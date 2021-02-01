const stripComments = require('strip-comments');


/**
 * Remove comments from javascript code.
 * @param {string} x javascript data
 * @param {boolean} ln keep empty lines?
 */
function jsUncomment(x, ln=false) {
  x = stripComments(x);
  // x = x.replace(/\s+(\n)/g, '\n');
  x = x.replace(/\/\*\*.*?\*\//gs, '');
  x = x.replace(/\n\s*\n+/g, ln? '\n' : '\n\n');
  return x.trim()+'\n';
}
module.exports = jsUncomment;
