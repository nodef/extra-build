const asciinema = require('extra-asciinema');
const tempy = require('tempy');


/**
 * Record execution of javascript file, and get its asciinema URL.
 * @param {string} pth path of javascript file
 * @param {object} o options (see extra-asciinema options)
 */
function asciinemaUpload(pth, o) {
  console.log(`Uploading asciinema for ${pth} ...`);
  var f = tempy.file({extension: 'cast'});
  asciinema.recSync(f, Object.assign({input: pth}, o));
  asciinema.retimeSync(f, o);
  return asciinema.uploadSync(f);
}
module.exports = asciinemaUpload;
