const mdExample = require('./mdExample');
const asciinemaUpload = require('./asciinemaUpload');
const tempy = require('tempy');
const fs = require('fs');


function mdAsciinema(md, re) {
  var ex = mdExample(md, re);
  var f = tempy.file();
  fs.writeFileSync(f, ex);
  return asciinemaUpload(f);
}
module.exports = mdAsciinema;
