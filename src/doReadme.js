const console = require('./console');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks');
const mdSetTable = require('./mdSetTable');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const fs = require('fs');


function doReadme(pth, jsdocs, o) {
  var pth = pth||'README.md';
  console.log(`Updating README ...`);
  var md = fs.readFileSync(pth, 'utf8');
  var diffCodeBlocks = gitDiffCodeBlocks(pth).length>0;
  var o = Object.assign({}, o, {diffCodeBlocks});
  md = mdSetTable(md, jsdocs);
  md = mdLinkWikis(md, o);
  md = mdLinkBasics(md, o);
  fs.writeFileSync(pth, md);
}
module.exports = doReadme;
