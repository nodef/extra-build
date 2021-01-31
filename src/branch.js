const console = require('./console');
const dirFiles = require('./dirFiles');
const branchOne = require('./branchOne');
const path = require('path');
const publishDo = require('./publishDo');
const publishDefault = require('./publishDefault');
const publishMin = require('./publishMin');


function branch(dir, o) {
  var dir = dir||'src';
  console.log(`BranchPublish: Starting for ${o.name} ...`);
  // execTsc(o.source, o.tsc);
  for (var f of dirFiles(dir)) {
    var pth = path.join(dir, f);
    publishDo(o, () => {
      var p = branchOne(pth, o);
      publishDo(p, publishDefault);
      if (p.publishMin) publishDo(p, publishMin);
    });
    console.log();
  }
}
module.exports = branch;
