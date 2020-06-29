const dirExports = require('./dirExports');
const fileRead = require('./fileRead');
const jsExports = require('./jsExports');
const jsExportsRemove = require('./jsExportsRemove');
const pathReplaceExt = require('./pathReplaceExt');
const kleur = require('kleur');
const path = require('path');
const fs = require('fs');

const OPTIONS = {
  format: 'es'
};


function updateExports(pth, o) {
  var ext = fs.existsSync('src/index.ts')? '.ts' : '.js';
  var pth = pth||`src/index${ext}`;
  var dec = pathReplaceExt(pth, '.d'+ext);
  var dir = path.dirname(pth);
  var o = Object.assign({}, OPTIONS, o);
  console.log(kleur.bold().cyan('updateExports:'), pth);
  var d = jsExportsRemove(fileRead(pth));
  var custom = jsExports(d);
  fs.writeFileSync(pth, d + dirExports(dir, o.format, custom));
  fs.writeFileSync(dec, dirExports(dir, o.format));
}
module.exports = updateExports;
