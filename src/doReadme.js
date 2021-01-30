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
  var diffCodeBlocks = o.readmeAsciinema && gitDiffCodeBlocks(pth).length>0;
  var o = Object.assign({}, o, {diffCodeBlocks});
  if (o.readmeTable)  md = mdSetTable(md, jsdocs);
  if (o.readmeLinks)  md = mdLinkWikis(md, o);
  if (o.readmeHeader) md = mdLinkBasics(md, o.readmeHeader, o);
  fs.writeFileSync(pth, md);
}
module.exports = doReadme;
