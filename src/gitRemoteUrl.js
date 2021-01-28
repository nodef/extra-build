const cpExecStr = require('./cpExecStr');

function gitRemoteUrl() {
  return cpExecStr(`git config --get remote.origin.url`);
}
module.exports = gitRemoteUrl;
