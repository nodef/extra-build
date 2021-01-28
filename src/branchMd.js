const fs = require('fs');
const {EOL} = require('os');


// Update README.md based on scatter options.
function branchMd(pth, o) {
  var pth = pth||'README.md', o = o||{};
  console.log(`Branching MD ${pth} ...`);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.noteTop||/\s+```/, '<br>'+EOL+
    `> This is part of package [${o.nameRoot}].`+EOL+EOL+
    `[${o.nameRoot}]: https://www.npmjs.com/package/${o.nameRoot}`+EOL+EOL+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, d);
}
module.exports = branchMd;
