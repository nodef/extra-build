const URLREPO = require('./URLREPO');
const cpExec = require('./cpExec');
const fs = require('fs');


async function initWiki(pth, o) {
  var pth = pth||'wiki';
  console.log('initWiki:', pth, o);
  if(fs.existsSync(pth)) return cpExec('git submodule update --init');
  var url = o.repo_url||URLREPO;
  cpExec(`git submodule add ${url} ${pth}`);
}
module.exports = initWiki;
