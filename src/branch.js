const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const dirFiles = require('./dirFiles');
const branchOne = require('./branchOne');
const minify = require('./minify');
const path = require('path');


function branch(dir, o) {
  var dir = dir||'src';
  console.log(`Starting branch publish for ${o.name} ...`);
  // execTsc(o.source, o.tsc);
  for (var f of dirFiles(dir)) {
    try {
    var pth = path.join(dir, f);
    var meta = fileRead(o.metadata);
    var readme = fileRead(o.readme);
    var p = branchOne(pth, o);
    cpExec('npm publish');
    minify('.', p);
    cpExec('npm publish');
    fs.writeFileSync(o.metadata, meta);
    fs.writeFileSync(o.readme, readme);
    }
    catch(e) { console.error(e); }
    console.log();
  }
}
module.exports = branch;
