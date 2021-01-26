const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const URLNPM = require('./URLNPM');
const mdHeading = require('./mdHeading');
const octokit = require('./octokit');
const fs = require('fs');


async function githubUpdateDetails(opt={}) {
  var o = opt||{};
  var owner = o.org||ORG;
  var repo = o.package_root||PACKAGE;
  var readme = o.readme_path||'README.md';
  var md = fs.readFileSync(readme, 'utf8');
  var description = o.description||mdHeading(md);
  var homepage = o.homepage||URLNPM;
  var c = {owner, repo, description, homepage};
  await octokit.repos.update(c);
  return c;
}
module.exports = githubUpdateDetails;
