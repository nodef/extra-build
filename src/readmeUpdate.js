const mdSetTable = require('./mdSetTable');
const mdSetLinks = require('./mdSetLinks');
const fs = require('fs');


function readmeUpdate(os, ot) {
  var p = 'README.md';
  var md = fs.readFileSync(p, 'utf8');
  md = mdSetTable(md, os);
  md = mdSetLinks(md, ot);
  fs.writeFileSync(p, md);
}
module.exports = readmeUpdate;
