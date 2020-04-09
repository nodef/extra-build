const mdExample = require('./mdExample');
const fs = require('fs');


function updateExample(pth, o) {
  var pth = pth||'example.js';
  var o = Object.assign({readme: 'README.md'}, o);
  var d = fs.readFileSync(o.readme, 'utf8');
  var ex = mdExample(d, o.example_lang);
  if(!ex) return;
  console.log('updateExample:', pth, o);
  fs.writeFileSync(pth, ex);
}
module.exports = updateExample;
