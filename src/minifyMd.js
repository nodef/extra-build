const fs = require('fs');
const {EOL} = require('os');


// Adds minified message to README.md in place.
function minifyMd(pth, o) {
  var pth = pth||'README.md', o = o||{};
  console.log(`Minifying MD at ${pth} ...`);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.noteMinified||/^> .*?minified.*$/m, '');
  d = d.replace(o.noteTop||/\s+```/, '<br>'+EOL+
    `> This is browserified, minified version of [${o.name}].<br>`+EOL+
    `> It is exported as global variable **${o.standalone}**.<br>`+EOL+
    `> CDN: [unpkg], [jsDelivr].`+EOL+EOL+
    `[${o.name}]: https://www.npmjs.com/package/${o.name}`+EOL+
    `[unpkg]: https://unpkg.com/${o.name}.min`+EOL+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.name}.min`+EOL+EOL+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, d);
}
module.exports = minifyMd;
