const console = require('./console');
const fs = require('fs');
const eolSet = require('./eolSet');


// Adds minified message to README.md in place.
function minifyMd(pth, o) {
  console.log(`Minifying README for ${o.name}.min ...`);
  var d = eolSet(fs.readFileSync(pth, 'utf8'), '\n');
  d = d.replace(o.noteMinified||/^> .*?minified.*$/m, '');
  d = d.replace(o.noteTop||/\s+```/, '<br>\n'+
    `> This is browserified, minified version of [${o.name}].<br>\n`+
    `> It is exported as global variable **${o.standalone}**.<br>\n`+
    `> CDN: [unpkg], [jsDelivr].\n\n`+
    `[${o.name}]: https://www.npmjs.com/package/${o.name}\n`+
    `[unpkg]: https://unpkg.com/${o.name}.min\n`+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.name}.min\n\n`+
    (o.noteTopValue||'```')
  );
  fs.writeFileSync(pth, eolSet(d));
}
module.exports = minifyMd;
