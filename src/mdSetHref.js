const {EOL} = require('os');

const RLAST = /(\r?\n)(\r?\n)+$|\[.*?\]:\s+.*?\n$/;

function mdSetHref(x, k, v) {
  var re = new RegExp(`\\[${k}\\]:\\s+[^\\r\\n]\r?\n`, 'g'), has = false;
  x = x.replace(re, (m, p1) => {
    if(!has || p1===v) { has = true; return m; }
    console.log('mdSetHref: remove', k, v); return '';
  });
  if(has || v==null) return x;
  console.log('mdSetHref: add', k, v);
  if(!RLAST.test(x)) x += EOL;
  x += `[${k}]: ${v}`+EOL;
  return x;
}
module.exports = mdSetHref;
