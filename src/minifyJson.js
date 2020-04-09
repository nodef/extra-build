const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');


// Adds minified message to package.json in place.
function minifyJson(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log('minifyJson: ', pth, o);
  var x = jsonRead(pth);
  x.name += '.min';
  x.description = x.description.replace('.$', ' (browserified, minifined).');
  x.scripts = {test: 'exit'};
  x.devDependencies = undefined;
  jsonWrite(pth, x);
}
module.exports = minifyJson;