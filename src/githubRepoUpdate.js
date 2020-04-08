const org = require('./org');
const packageName = require('./packageName');
const packageUrl = require('./packageUrl');
const mdHeading = require('./mdHeading');
const octokit = require('./octokit');

async function githubRepoUpdate(o) {
  var o = o||{};
  var owner = o.org||org;
  var repo = o.package_root||packageName;
  var description = o.description||mdHeading();
  var homepage = o.homepage||packageUrl();
  var has_wiki = o.has_wiki===false? false : true;
  var c = {owner, repo, description, homepage, has_wiki};
  console.log('githubRepoUpdate:', c);
  await octokit.repos.update(c);
}
module.exports = githubRepoUpdate;
