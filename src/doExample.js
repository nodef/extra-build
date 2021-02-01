const console = require('./console');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const mdExample = require('./mdExample');


/**
 * Generate example.js from README.
 * @param {string} pth path of README file
 * @param {object} o options {out, language}
 */
function doExample(pth, o) {
  var pth = pth||'README.md';
  console.log(`Generating example ${o.example} ...`);
  var md = fileRead(pth);
  var ex = mdExample(md, o.exampleComments);
  if (ex) fileWrite(o.example, ex);
}
module.exports = doExample;
