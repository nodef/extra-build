const cpExec = require('./cpExec');
const fs = require('fs');

const UGLIFYLIMIT = 4*1024*1024;


// Minifies JS file in place.
function minifyJs(pth, o) {
  console.log(`Minifying JS for ${o.name}.min ...`);
  var s = fs.statSync(pth);
  // cpExec(`.rollup --format=cjs --file=${pth}.1 -- ${pth}`);
  cpExec(`browserify "${pth}" -s ${o.standalone} -o "${pth}.1"`);
  cpExec(`mv "${pth}.1" "${pth}"`);
  try {
  if(s.size<UGLIFYLIMIT) cpExec(`.uglifyjs -c -m -o "${pth}.1" "${pth}"`);
  if(s.size<UGLIFYLIMIT) cpExec(`mv "${pth}.1" "${pth}"`);
  }
  catch(e) { console.error(e); }
}
module.exports = minifyJs;
