const mdExample = require('./mdExample');
const asciinemaUpload = require('./asciinemaUpload');
const path = require('path');
const fs = require('fs');


/**
 * Get Asciinema URL for example in markdown.
 * @param {string} md markdown data
 * @param {object} o options {package, exampleDir}
 */
function mdAsciinema(md, o) {
  var ex = mdExample(md);
  var cwd = o.exampleDir;
  var f = path.join(cwd, 'example.js');
  fs.writeFileSync(f, ex);
  return asciinemaUpload(f, {title: o.package||o.packageRoot});
}
module.exports = mdAsciinema;
