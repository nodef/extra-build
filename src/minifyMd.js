const fs = require('fs');
const {EOL} = require('os');


// Adds minified message to README.md in place.
function minifyMd(pth, o) {
  var pth = pth||'README.md', o = o||{};
  console.log('minifyMd:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.noteMinified||/^> .*?minified.*$/m, '');
  d = d.replace(o.noteTop||/\s+```/, '<br>'+EOL+
    `> This is browserified, minified version of [${o.subpackage}].<br>`+EOL+
    `> It is exported as global variable **${o.substandalone}**.<br>`+EOL+
    `> CDN: [unpkg], [jsDelivr].`+EOL+EOL+
    `[${o.package}]: https://www.npmjs.com/package/${o.subpackage}`+EOL+
    `[unpkg]: https://unpkg.com/${o.subpackage}.min`+EOL+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.subpackage}.min`+EOL+EOL+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, d);
}
module.exports = minifyMd;
