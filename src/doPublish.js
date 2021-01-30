const console = require('./console');
const cpExec = require('./cpExec');
const branch = require('./branch');
const fileRead = require('./fileRead');
const minify = require('./minify');
const fs = require('fs');


function doPublish(o) {
  console.log(`Publish: Publishing package ...`);
  pubDefault();
  if (o.publishMin) pubMin();
  if (o.publishBranch) branch(o.sourceDir, o);
}


function pubDefault() {
  try { cpExec(`npm publish`); }
  catch (e) { console.error(e); }
}

function pubMin() {
  try {
    var meta = fileRead(o.meta);
    var readme = fileRead(o.readme);
    minify('.', o);
    cpExec(`npm publish`);
    fs.writeFileSync(o.meta, meta);
    fs.writeFileSync(o.readme, readme);
  }
  catch (e) { console.error(e); }
}
module.exports = doPublish;
