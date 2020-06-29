const fs = require('fs');


// Update index.js to use README.md
function scatterJs(pth, o) {
  var pth = pth||'index.js', o = o||{};
  console.log('scatterJs:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(new RegExp(`less (.*?)${o.symbol}.md`, 'g'), `less $1README.md`);
  fs.writeFileSync(pth, d);
}
module.exports = scatterJs;
