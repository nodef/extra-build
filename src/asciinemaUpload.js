const asciinema = require('extra-asciinema');
const tempy = require('tempy');


function asciinemaUpload(o={}, pth='example.js') {
  var f = tempy.file({extension: 'cast'});
  asciinema.recSync(f, Object.assign({input: pth}, o));
  asciinema.retimeSync(f, o);
  return asciinema.uploadSync(f);
}
module.exports = asciinemaUpload;
