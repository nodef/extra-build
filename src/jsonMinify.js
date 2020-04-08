const fs = require('fs');


// Adds minified message to package.json in place.
function jsonMinify(pth, o) {
  console.log('jsonMinify: ', pth, o);
  var d = JSON.parse(fs.readFileSync(pth, 'utf8'));
  d.name += '.min';
  d.description = d.description.replace('.$', ' (browserified, minifined).');
  d.scripts = {test: 'exit'};
  d.devDependencies = undefined;
  fs.writeFileSync(pth, JSON.stringify(d, null, 2));
  return d.name.replace(/\.min$/, '');
}
module.exports = jsonMinify;
