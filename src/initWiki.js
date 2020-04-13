const URLREPO = require('./URLREPO');
const cpExec = require('./cpExec');
const dirFiles = require('./dirFiles');
const fileSymbol = require('./fileSymbol');
const fs = require('fs');
const path = require('path');


async function initWiki(pth, o) {
  var pth = pth||'wiki';
  var o = Object.assign({url: URLREPO+'.wiki'}, o);
  console.log('initWiki:', pth, o);
  if(fs.existsSync(pth)) cpExec('git submodule update --init');
  else cpExec(`git submodule add ${o.url} ${pth}`);
  var src = o.src_dir||'src';
  for(var f of dirFiles(src)) {
    f = path.join(pth, fileSymbol(f)+'.md');
    if(!fs.existsSync(f)) fs.writeFileSync(f, '');
  }
}
module.exports = initWiki;
