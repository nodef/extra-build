const fs = require('fs');
const os = require('os');

const {EOL} = os;


// Initializes gitignore file.
function ignoreAdd(pth, sections) {
  var d = fs.readFileSync(pth, 'utf8'), a = '';
  for(var [k, ls] of sections) {
    if(d.includes('# '+k)) continue;
    a += '# '+k+EOL;
    a += ls.join(EOL)+EOL+EOL;
  }
  if(!a) return;
  console.log('ignoreAdd:', pth, sections);
  fs.writeFileSync(pth, a+d);
}
module.exports = ignoreAdd;
