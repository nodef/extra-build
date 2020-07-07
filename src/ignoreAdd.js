const fs = require('fs');
const {EOL} = require('os');


// Initializes gitignore file.
function ignoreAdd(pth, sections) {
  var e = fs.existsSync(pth), a = '';
  var d = e? fs.readFileSync(pth, 'utf8') : '';
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
