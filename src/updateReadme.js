const gitDiffCodeBlocks = require('./gitDiffCodeBlocks');
const mdSetTable = require('./mdSetTable');
const mdSetLinks = require('./mdSetLinks');
const mdSetEmoji = require('./mdSetEmoji');
const fs = require('fs');


function updateReadme(pth, jsdocs, o) {
  var pth = pth||'README.md';
  console.log('updateReadme:', pth, o);
  var md = fs.readFileSync(pth, 'utf8');
  var diff_code_blocks = gitDiffCodeBlocks(p).length>0;
  var o = Object.assign({}, o, {diff_code_blocks});
  md = mdSetTable(md, jsdocs);
  md = mdSetLinks(md, o);
  md = mdSetEmoji(md, o);
  fs.writeFileSync(pth, md);
}
module.exports = updateReadme;
