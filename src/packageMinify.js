const jsonMinify = require('./jsonMinify');
const mdMinify = require('./mdMinify');
const jsMinify = require('./jsMinify');
const path = require('path');


// Minifies package in place.
function packageMinify(pth, o) {
  console.log('packageMinify: ', pth, o);
  var o = Object.assign({}, o);
  o.package = jsonMinify(path.join(pth, 'package.json'), o);
  mdMinify(path.join(pth, 'README.md'), o);
  jsMinify(path.join(pth, 'index.js'), o);
}
module.exports = packageMinify;
