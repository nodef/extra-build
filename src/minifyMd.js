const console = require('./console');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');


// Adds minified message to README.md in place.
function minifyMd(pth, o) {
  console.log(`Minifying README for ${o.name}.min ...`);
  var d = fileRead(pth);
  d = d.replace(o.noteMinified||/^> .*?minified.*$/m, '');
  d = d.replace(o.noteTop||/(\s+<br>)?\s+```/, '\n\n'+
    `> This is browserified, minified version of [${o.name}].<br>\n`+
    `> It is exported as global variable **${o.standalone}**.<br>\n`+
    `> CDN: [unpkg], [jsDelivr].\n\n`+
    `[${o.name}]: https://www.npmjs.com/package/${o.name}\n`+
    `[unpkg]: https://unpkg.com/${o.name}.min\n`+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.name}.min\n\n`+
    '<br>\n\n'+
    (o.noteTopValue||'```')
  );
  fileWrite(pth, d);
}
module.exports = minifyMd;
