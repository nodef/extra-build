const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');


// Adds minified message to package.json in place.
function minifyMeta(pth, o) {
  var m = jsonRead(pth);
  m.name += '.min';
  console.log(`Minifying metadata for ${o.name}.min ...`);
  m.description = m.description.replace('.$', ' (browserified, minified).');
  m.type = undefined;
  m.scripts = {test: 'exit'};
  m.devDependencies = m.dependencies;
  m.dependencies = undefined;
  jsonWrite(pth, m);
}
module.exports = minifyMeta;
