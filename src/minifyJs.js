const cpExec = require('./cpExec');
const fs = require('fs');

const UGLIFYLIMIT = 4*1024*1024;


// Minifies JS file in place.
function minifyJs(pth, o) {
  var pth = pth||'index.js', o = o||{};
  console.log('minifyJs: ', pth, o);
  var s = fs.statSync(pth);
  cpExec(`.browserify ${pth} -s ${o.standalone} -o ${pth}.tmp`);
  if(s.size<UGLIFYLIMIT) cpExec(`.uglifyjs -c -m -o ${pth} ${pth}.tmp`);
  else cpExec(`mv ${pth}.tmp ${pth}`);
  cpExec(`rm -f ${pth}.tmp`);
}
module.exports = minifyJs;
