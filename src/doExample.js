const mdExample = require('./mdExample');
const fs = require('fs');

const OPTIONS = {
  out: 'example.js'
};


/**
 * Generate example.js from README.
 * @param {string} pth path of README file
 * @param {object} opt options {out, language}
 */
function doExample(pth, opt={}) {
  var o = Object.assign({}, OPTIONS, opt);
  var md = pth||'README.md';
  var d = fs.readFileSync(md, 'utf8');
  var ex = mdExample(d, o.language);
  if (ex) fs.writeFileSync(o.out, ex);
}
module.exports = doExample;
