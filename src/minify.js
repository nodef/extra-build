const jsonRead = require('./jsonRead');
const minifyJson = require('./minifyJson');
const minifyMd = require('./minifyMd');
const minifyJs = require('./minifyJs');
const path = require('path');
const fs = require('fs');


// Minifies package in place.
function minify(pth, o) {
  var o = o||{};
  var json = path.join(pth, 'package.json');
  var readme = path.join(pth, 'README.md');
  var main = path.join(pth, 'index.js');
  var hasMd = fs.existsSync(readme);
  o.package = o.package||jsonRead(json).name;
  console.log('minify:', pth, o);
  minifyJson(json, o);
  if(hasMd) minifyMd(readme, o);
  minifyJs(main, o);
}
module.exports = minify;
