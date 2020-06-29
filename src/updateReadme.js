const gitDiffCodeBlocks = require('./gitDiffCodeBlocks');
const mdSetTable = require('./mdSetTable');
const mdLinkWikis = require('./mdLinkWikis');
const mdLinkBasics = require('./mdLinkBasics');
const kleur = require('kleur');
const fs = require('fs');


function updateReadme(pth, jsdocs, o) {
  var pth = pth||'README.md';
  console.log(kleur.bold().cyan('updateReadme:'), pth);
  var md = fs.readFileSync(pth, 'utf8');
  var diff_code_blocks = gitDiffCodeBlocks(pth).length>0;
  var o = Object.assign({}, o, {diff_code_blocks});
  md = mdSetTable(md, jsdocs);
  md = mdLinkWikis(md, o);
  md = mdLinkBasics(md, o);
  fs.writeFileSync(pth, md);
  console.log();
}
module.exports = updateReadme;
