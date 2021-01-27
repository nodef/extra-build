const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const urlPackage = require('./urlPackage');
const mdHeading = require('./mdHeading');
const octokit = require('./octokit');
const fs = require('fs');


// TODO: use package.json description
/**
 * Update GitHub description, homepage from README.
 * @param {object} o options
 */
async function githubUpdateDetails(o={}) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.packageRoot||PACKAGE;
  var readme = o.readmeRath||'README.md';
  var md = fs.readFileSync(readme, 'utf8');
  var description = o.description||mdHeading(md);
  var homepage = o.homepage||urlPackage(o);
  var c = {owner, repo, description, homepage};
  await octokit.repos.update(c);
  return c;
}
module.exports = githubUpdateDetails;
