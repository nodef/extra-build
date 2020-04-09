const asciinema = require('extra-asciinema');
const tempy = require('tempy');


// Records execution of a js file, and gives its asciinema URL.
function asciinemaUpload(pth, o) {
  console.log('asciinemaUpload:', pth, o);
  var f = tempy.file({extension: 'cast'});
  asciinema.recSync(f, Object.assign({input: pth}, o));
  asciinema.retimeSync(f, o);
  return asciinema.uploadSync(f);
}
module.exports = asciinemaUpload;
