const mdCodeBlocks = require('./mdCodeBlocks');
const fs = require('fs');


function updateExample(o={}, pth='example.js') {
  var f = o.readme||'README.md';
  var d = fs.readFileSync(f, 'utf8');
  var re = o.example_lang||null;
  var blocks = mdCodeBlocks(d, re);
  if(blocks.length===0) return;
  console.log('updateExample:', o, pth);
  fs.writeFileSync(pth, blocks[0]);
}
module.exports = updateExample;
