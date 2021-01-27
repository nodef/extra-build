const fs = require('fs');
const {EOL} = require('os');


// Update README.md based on scatter options.
function scatterMd(pth, o) {
  var pth = pth||'README.md', o = o||{};
  console.log('scatterMd:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.noteTop||/\s+```/, '<br>'+EOL+
    `> This is part of package [${o.packageRoot}].`+EOL+EOL+
    `[${o.packageRoot}]: https://www.npmjs.com/package/${o.packageRoot}`+EOL+EOL+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, d);
}
module.exports = scatterMd;
