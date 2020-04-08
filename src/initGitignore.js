const fs = require('fs');
const os = require('os');

const GITIGNORES = new Map([
  ['Generated files', ['*.js', '*.d.ts', '*.map']]
]);
const {EOL} = os;


// Initializes gitignore file.
function initGitignore(o={}, pth='.gitignore') {
  var gitignores = o.gitignores||GITIGNORES;
  var d = fs.readFileSync(pth, 'utf8'), a = '';
  for(var [k, ls] of gitignores) {
    if(d.includes('# '+k)) continue;
    a += '# '+k+EOL;
    a += ls.join(EOL)+EOL+EOL;
  }
  if(!a) return;
  console.log('initGitignore:', o, pth);
  console.log(a);
  fs.writeFileSync(pth, a+d);
}
module.exports = initGitignore;
