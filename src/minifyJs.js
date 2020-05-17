const cpExec = require('./cpExec');
const fs = require('fs');

const UGLIFYLIMIT = 4*1024*1024;


// Minifies JS file in place.
function minifyJs(pth, o) {
  var pth = pth||'index.js', o = o||{};
  console.log('minifyJs: ', pth, o);
  var s = fs.statSync(pth);
  // cpExec(`.rollup --format=cjs --file=${pth}.1 -- ${pth}`);
  cpExec(`.browserify ${pth} -s ${o.standalone} -o ${pth}.2`);
  if(s.size<UGLIFYLIMIT) cpExec(`.uglifyjs -c -m -o ${pth} ${pth}.2`);
  else cpExec(`mv ${pth}.2 ${pth}`);
  cpExec(`rm -f ${pth}.1`);
  cpExec(`rm -f ${pth}.2`);
}
module.exports = minifyJs;
