const jsonRead = require('./jsonRead');
const jsonMinify = require('./jsonMinify');
const mdMinify = require('./mdMinify');
const jsMinify = require('./jsMinify');
const path = require('path');


// Minifies package in place.
function packageMinify(pth, o) {
  var o = o||{};
  var json = path.join(pth, 'package.json');
  var readme = path.join(pth, 'README.md');
  var main = path.join(pth, 'index.js');
  o.package = o.package||jsonRead(json).name;
  console.log('packageMinify: ', pth, o);
  jsonMinify(json, o);
  mdMinify(readme, o);
  jsMinify(main, o);
}
module.exports = packageMinify;
