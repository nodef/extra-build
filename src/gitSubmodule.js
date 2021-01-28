const cpExec = require('./cpExec');


function gitSubmodule(url, dir) {
  if (!url) return cpExec(`git submodule update --remote --merge`);
  cpExec(`git submodule add ${url} "${dir}"`);
  cpExec(`git submodule update --init`);
}
module.exports = gitSubmodule;
