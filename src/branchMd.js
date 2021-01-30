const console = require('./console');
const fs = require('fs');
const eolSet = require('./eolSet');


// Update README.md based on scatter options.
function branchMd(pth, o) {
  var pth = pth||'README.md';
  console.log(`Branching README for ${o.name} ...`);
  var d = eolSet(fs.readFileSync(pth, 'utf8'), '\n');
  d = d.replace(o.noteTop||/\s+```/, '<br>\n'+
    `> This is part of package [${o.nameRoot}].\n\n`+
    `[${o.nameRoot}]: https://www.npmjs.com/package/${o.nameRoot}\n\n`+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, eolSet(d));
}
module.exports = branchMd;
