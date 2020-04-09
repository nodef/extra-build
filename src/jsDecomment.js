const stripComments = require('strip-comments');


function jsDecomment(x) {
  x = stripComments(x);
  x = x.replace(/(\r?\n)(\r?\n)+/g, '$1$2');
  return x.trim()+'\n';
}
module.exports = jsDecomment;
