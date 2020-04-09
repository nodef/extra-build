const jsonRead = require('./jsonRead');
const minifyJson = require('./minifyJson');
const mdMinify = require('./mdMinify');
const jsMinify = require('./jsMinify');
const path = require('path');


// Minifies package in place.
function minify(pth, o) {
  var o = o||{};
  var json = path.join(pth, 'package.json');
  var readme = path.join(pth, 'README.md');
  var main = path.join(pth, 'index.js');
  o.package = o.package||jsonRead(json).name;
  console.log('minify: ', pth, o);
  minifyJson(json, o);
  mdMinify(readme, o);
  jsMinify(main, o);
}
module.exports = minify;
