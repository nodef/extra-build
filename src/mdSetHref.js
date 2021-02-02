const console = require('./console');

const RLAST = /\n\n+$|\[.*?\]:\s+.*?\n$/;
const RHREF = /\[(.*?)\]:\s+([^\n]+)\n/g;


function mdSetHref(md, k, v) {
  var has = false;
  md = md.replace(RHREF, (m, p1, p2) => {
    if(p1!==k) return m;
    if(!has && p2===v) { has = true; return m; }
    console.log(`Rmved href [${p1}]: ${p2}`); return '';
  });
  if(has || v==null) return md;
  console.log(`Added href [${k}]: ${v}`);
  if(!RLAST.test(md)) md += '\n';
  md += `[${k}]: ${v}\n`;
  return md;
}
module.exports = mdSetHref;
