const cpExec = require('./cpExec');


// Download page from wiki.
function wikiDownload(pth, o) {
  console.log('wikiDownload:', pth, o);
  var wiki = 'https://raw.githubusercontent.com/wiki/';
  var url = `${wiki}${o.org}/${o.package_root}/${o.readme}.md`;
  cpExec(`.download ${url} > ${pth}`);
}
module.exports = wikiDownload;
