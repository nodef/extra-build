const console = require('./console');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const jsEditJsdocs = require('./jsEditJsdocs');


// Update index.js to use README.md
function branchJs(pth, o) {
  var pth = pth||'index.js';
  console.log(`Branching JS for ${o.name} ...`);
  var d = fileRead(pth);
  d = jsEditJsdocs(d, o);
  d = d.replace(new RegExp(`less (.*?)${o.symbol}.md`, 'g'), `less $1README.md`);
  fileWrite(pth, d);
}
module.exports = branchJs;
