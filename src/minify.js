const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const minifyMeta = require('./minifyMeta');
const minifyMd = require('./minifyMd');
const minifyJs = require('./minifyJs');
const path = require('path');
const fs = require('fs');


// Minifies package in place.
function minify(pth, o) {
  var meta = path.join(pth, 'package.json');
  var readme = path.join(pth, 'README.md');
  var main = path.join(pth, 'index.js');
  var hasMd = fs.existsSync(readme);
  o.name = o.name||jsonRead(meta).name;
  console.log(`Minifying package for ${o.name}.min ...`);
  minifyMeta(meta, o);
  if (hasMd) minifyMd(readme, o);
  minifyJs(main, o);
}
module.exports = minify;
