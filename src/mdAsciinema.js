const asciinemaUpload = require('./asciinemaUpload');
const mdExample = require('./mdExample');
const initExample = require('./initExample');
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
  var meta = path.join(cwd, 'package.json');
  if (!fs.existsSync(meta)) initExample(o);
  var f = path.join(cwd, 'example.js');
  fs.writeFileSync(f, ex);
  return asciinemaUpload(f, {title: o.subname||o.name});
}
module.exports = mdAsciinema;
