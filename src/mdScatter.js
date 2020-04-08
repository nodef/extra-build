const fs = require('fs');


// Update README.md based on scatter options.
function mdScatter(pth, o) {
  console.log('mdScatter:', pth, o);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.note_top||/\s+```/, '<br>'+EOL+
    `> This is part of package [${o.package_root}].`+EOL+EOL+
    `[${o.package_root}]: https://www.npmjs.com/package/${o.package_root}`+EOL+EOL+
    (o.note_topvalue||'```')
  );
  fs.writeFileSync(pth, d);
}
module.exports = mdScatter;
