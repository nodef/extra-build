const cpExec = require('./cpExec');
const scatter = require('./branch');


function doPublish(o) {
  console.log(`Publishing package ...`);
  try { cpExec(`npm publish`); }
  catch (e) { console.error(e); }
  if (o.subpublish) scatter(o.sourceDir, o);
}
module.exports = doPublish;
