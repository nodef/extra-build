const console = require('./console');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');


// Update README.md based on scatter options.
function branchMd(pth, o) {
  var pth = pth||'README.md';
  console.log(`Branching README for ${o.name} ...`);
  var d = fileRead(pth);
  d = d.replace(o.noteTop||/(\s+<br>)?\s+```/, '\n\n'+
    `> This is part of package [${o.nameRoot}].\n\n`+
    `[${o.nameRoot}]: https://www.npmjs.com/package/${o.nameRoot}\n\n`+
    '<br>\n\n'+
    (o.noteTopValue||'```')
  );
  fileWrite(pth, d);
}
module.exports = branchMd;
