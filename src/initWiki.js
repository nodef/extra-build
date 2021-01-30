const console = require('./console');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const gitSubmodule = require('./gitSubmodule');
const fs = require('fs');
const path = require('path');


/**
 * Initialize Wiki with new pages.
 * @param {string} dir path of source directory
 * @param {object} o options
 */
function initWiki(dir, o) {
  var dir = dir||'src';
  var {wikiDir: wiki, wikiUrl: url} = o;
  console.log(`Initializing wiki for directory ${dir} ...`);
  if (!fs.existsSync(wiki)) gitSubmodule(url, wiki);
  gitSubmodule();
  for(var f of dirFiles(dir)) {
    f = path.join(wiki, fileSymbol(f)+'.md');
    if(!fs.existsSync(f)) fs.writeFileSync(f, '');
  }
}
module.exports = initWiki;
