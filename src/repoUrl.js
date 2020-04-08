const org = require('./org');
const packageName = require('./packageName');

function repoUrl(o) {
  var orgn = o.org||org;
  var repo = o.repo||o.package_root||packageName;
  return `https://github.com/${orgn}/${repo}`;
}
module.exports = repoUrl;
