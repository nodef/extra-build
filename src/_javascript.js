const stripComments = require('strip-comments');




/**
 * Remove comments from javascript text.
 * @param {string} txt javascript text
 * @param {boolean} empty keep empty lines?
 */
 function uncomment(txt, empty=false) {
  txt = stripComments(txt);
  // txt = txt.replace(/\s+(\n)/g, '\n');
  txt = txt.replace(/\/\*\*.*?\*\//gs, '');
  txt = txt.replace(/\n\s*\n+/g, empty? '\n' : '\n\n');
  return txt.trim() + '\n';
}
module.exports = {uncomment};
