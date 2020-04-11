const URLREPO = require('./URLREPO');
const cpExec = require('./cpExec');
const fs = require('fs');


async function initWiki(pth, o) {
  var pth = pth||'wiki';
  var o = Object.assign({url: URLREPO+'.wiki'}, o);
  console.log('initWiki:', pth, o);
  if(fs.existsSync(pth)) return cpExec('git submodule update --init');
  cpExec(`git submodule add ${o.url} ${pth}`);
}
module.exports = initWiki;
