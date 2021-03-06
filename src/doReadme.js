const console = require('./console');
const fileRead = require('./fileRead');
const fileWrite = require('./fileWrite');
const gitDiffCodeBlocks = require('./gitDiffCodeBlocks');
const mdSetTable = require('./mdSetTable');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');


function doReadme(pth, jsdocs, o) {
  var pth = pth||'README.md';
  console.log(`Updating README ...`);
  var md = fileRead(pth);
  var diffCodeBlocks = o.readmeAsciinema && gitDiffCodeBlocks(pth).length>0;
  var o = Object.assign({}, o, {diffCodeBlocks});
  if (o.readmeIndex)  md = mdSetTable(md, jsdocs);
  if (o.readmeLinks)  md = mdLinkWikis(md, o);
  if (o.readmeHeader) md = mdLinkBasics(md, o.readmeHeader, o);
  fileWrite(pth, md);
}
module.exports = doReadme;
