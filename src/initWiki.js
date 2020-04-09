const URLREPO = require('./URLREPO');
const fs = require('fs');
const cp = require('child_process');

const stdio = [0, 1, 2];


async function initWiki(pth, o) {
  var pth = pth||'wiki';
  console.log('initWiki:', pth, o);
  if(fs.existsSync(pth)) return cp.execSync('git submodule update --init', {stdio});
  var url = o.repo_url||URLREPO;
  cp.execSync(`git submodule add ${url} ${pth}`, {stdio});
}
module.exports = initWiki;
