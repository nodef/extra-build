const console = require('./console');
const branch = require('./branch');
const publishDo = require('./publishDo');
const publishDefault = require('./publishDefault');
const publishMin = require('./publishMin');


function doPublish(o) {
  console.log(`Publish: Publishing package ...`);
  publishDo(o, publishDefault);
  if (o.publishMin) publishDo(o, publishMin);
  if (o.publishBranch) branch(o.sourceDir, o);
}
module.exports = doPublish;
