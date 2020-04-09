const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const URLNPM = require('./URLNPM');
const mdHeading = require('./mdHeading');
const octokit = require('./octokit');


async function githubRepoUpdate(o) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.package_root||PACKAGE;
  var description = o.description||mdHeading();
  var homepage = o.homepage||URLNPM;
  var c = {owner, repo, description, homepage, has_wiki};
  console.log('githubRepoUpdate:', c);
  await octokit.repos.update(c);
}
module.exports = githubRepoUpdate;
