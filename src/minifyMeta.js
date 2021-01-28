const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');


// Adds minified message to package.json in place.
function minifyMeta(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log(`Minifying metadata at ${pth} ...`);
  var m = jsonRead(pth);
  m.name += '.min';
  m.description = m.description.replace('.$', ' (browserified, minifined).');
  m.type = undefined;
  m.scripts = {test: 'exit'};
  m.devDependencies = m.dependencies;
  m.dependencies = undefined;
  jsonWrite(pth, m);
}
module.exports = minifyMeta;
