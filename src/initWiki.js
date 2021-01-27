const URLREPO = require('./URLREPO');
const cpExec = require('./cpExec');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const gitCommit = require('./gitCommit');
const fs = require('fs');
const path = require('path');


/**
 * Initialize Wiki with new pages.
 * @param {string} dir path of source directory
 * @param {object} o options
 */
function initWiki(dir, o) {
  var dir = dir||'src';
  var o = Object.assign({url: URLREPO+'.wiki'}, o);
  console.log(`Initializing wiki for directory ${dir} ...`);
  console.log(`Wiki repository URL is ${o.url}`);
  var tmp = fs.mkdtempSync('wiki');
  var wiki = path.join(tmp, 'wiki');
  cpExec(`git clone ${o.url} ${wiki}`);
  for(var f of dirFiles(dir)) {
    f = path.join(wiki, fileSymbol(f)+'.md');
    if(!fs.existsSync(f)) fs.writeFileSync(f, '');
  }
  var cwd = process.cwd();
  process.chdir(wiki);
  gitCommit('initialize wiki');
  process.chdir(cwd);
  cpExec(`rm -rf ${tmp}`);
}
module.exports = initWiki;
