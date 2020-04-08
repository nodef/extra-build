const globalDirs = require('global-dirs');
const cp = require('child_process');

const BIN = globalDirs.npm.binaries+'/';


// Download page from wiki.
function wikiDownload(pth, o) {
  console.log('wikiDownload:', pth, o);
  var wiki = 'https://raw.githubusercontent.com/wiki/';
  var url = `${wiki}${o.org}/${o.package_root}/${o.readme}.md`;
  cp.execSync(BIN+`download ${url} > ${pth}`, {stdio});
}
module.exports = wikiDownload;
