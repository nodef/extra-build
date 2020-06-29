const mdExample = require('./mdExample');
const fs = require('fs');


function updateExample(pth, o) {
  var pth = pth||'example.js', o = o||{};
  var readme = o.readme_path||'README.md';
  var d = fs.readFileSync(readme, 'utf8');
  var ex = mdExample(d, o.example_lang);
  if(!ex) return;
  console.log('updateExample:', pth);
  fs.writeFileSync(pth, ex);
}
module.exports = updateExample;
