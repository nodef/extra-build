const mdSetTable = require('./mdSetTable');
const mdSetLinks = require('./mdSetLinks');
const fs = require('fs');


function updateReadme(pth, jsdocs, o) {
  var pth = pth||'README.md';
  console.log('updateReadme:', pth, o);
  var md = fs.readFileSync(pth, 'utf8');
  md = mdSetTable(md, jsdocs);
  md = mdSetLinks(md, o);
  fs.writeFileSync(pth, md);
}
module.exports = updateReadme;
