const mdExample = require('./mdExample');
const fs = require('fs');

const OPTIONS = {
  out: 'example.js'
};


/**
 * Generate example.js from README.
 * @param {string} pth path of README file
 * @param {object} o options {out, language}
 */
function doExample(pth, o) {
  var o = Object.assign({}, OPTIONS, o);
  var md = pth||'README.md';
  console.log(`Generating example ${o.example} ...`);
  var d = fs.readFileSync(md, 'utf8');
  var ex = mdExample(d, o.exampleComments);
  if (ex) fs.writeFileSync(o.example, ex);
}
module.exports = doExample;
