const console = require('./console');
const {EOL} = require('os');

const RLAST = /(\r?\n)(\r?\n)+$|\[.*?\]:\s+.*?\n$/;
const RHREF = /\[(.*?)\]:\s+([^\r\n]+)\r?\n/g;

function mdSetHref(x, k, v) {
  var has = false;
  x = x.replace(RHREF, (m, p1, p2) => {
    if(p1!==k) return m;
    if(!has && p2===v) { has = true; return m; }
    console.log(`Removed href [${p1}](${p2})`); return '';
  });
  if(has || v==null) return x;
  console.log(`Added href [${k}](${v})`);
  // if(!RLAST.test(x)) x += EOL;
  x += `[${k}]: ${v}`+EOL;
  return x;
}
module.exports = mdSetHref;
