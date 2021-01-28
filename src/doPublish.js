const cpExec = require('./cpExec');
const scatter = require('./scatter');


function doPublish(o) {
  cpExec(`npm publish`);
  if (o.subpublish) scatter(o.sourceDir, o);
}
module.exports = doPublish;
