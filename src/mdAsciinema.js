const asciinemaUpload = require('./asciinemaUpload');
const mdExample = require('./mdExample');
const initAsciinema = require('./initAsciinema');
const path = require('path');
const fs = require('fs');


/**
 * Get Asciinema URL for example in markdown.
 * @param {string} md markdown data
 * @param {object} o options {package, asciinemaDir}
 */
function mdAsciinema(md, o) {
  var ex = mdExample(md);
  var cwd = o.asciinemaDir;
  var meta = path.join(cwd, 'package.json');
  if (!fs.existsSync(meta)) initAsciinema(o);
  var f = path.join(cwd, 'example.js');
  fs.writeFileSync(f, ex);
  return asciinemaUpload(f, {title: o.name||o.nameRoot});
}
module.exports = mdAsciinema;
