const globalDirs = require('global-dirs');
const fs = require('fs');
const cp = require('child_process');

const BIN = globalDirs.npm.binaries+'/';
const stdio = [0, 1, 2];


// Minifies JS file in place.
function jsMinify(pth, o) {
  console.log('jsMinify: ', pth, o);
  var s = fs.statSync(pth);
  cp.execSync(BIN+`browserify ${pth} -s ${o.standalone} -o ${pth}.tmp`, {stdio});
  if(s.size<4*1024*1024) cp.execSync(BIN+`uglifyjs -c -m -o ${pth} ${pth}.tmp`, {stdio});
  else cp.execSync(`mv ${pth}.tmp ${pth}`, {stdio});
  cp.execSync(`rm -f ${pth}.tmp`, {stdio});
}
module.exports = jsMinify;
