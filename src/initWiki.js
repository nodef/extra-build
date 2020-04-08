const repoUrl = require('./repoUrl');
const fs = require('fs');
const cp = require('child_process');

const stdio = [0, 1, 2];


async function initWiki(o={}, pth='wiki') {
  console.log('initWiki:', o, pth);
  if(fs.existsSync(pth)) return cp.execSync('git submodule update --init', {stdio});
  var url = o.repo_url||repoUrl(o);
  console.log(url+'\n');
  cp.execSync(`git submodule add ${url} ${pth}`, {stdio});
}
module.exports = initWiki;
