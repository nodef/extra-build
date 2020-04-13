const mdExample = require('./mdExample');
const asciinemaUpload = require('./asciinemaUpload');
const path = require('path');
const fs = require('fs');


function mdAsciinema(md, o) {
  var ex = mdExample(md);
  var cwd = o.example_dir;
  var f = path.join(cwd, 'example.js');
  fs.writeFileSync(f, ex);
  return asciinemaUpload(f, {title: o.package||o.package_root});
}
module.exports = mdAsciinema;
