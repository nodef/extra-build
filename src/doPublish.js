const cpExec = require('./cpExec');
const branch = require('./branch');
const fileRead = require('./fileRead');
const minify = require('./minify');
const fs = require('fs');


function doPublish(o) {
  console.log(`Publishing package ...`);
  try {
    cpExec(`npm publish`);
    var meta = fileRead(o.metadata);
    var readme = fileRead(o.readme);
    minify('.', o);
    cpExec(`npm publish`);
    fs.writeFileSync(o.metadata, meta);
    fs.writeFileSync(o.readme, readme);
  }
  catch (e) { console.error(e); }
  if (o.subpublish) branch(o.sourceDir, o);
}
module.exports = doPublish;
