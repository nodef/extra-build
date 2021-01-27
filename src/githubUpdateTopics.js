const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const jsonRead = require('./jsonRead');
const octokit = require('./octokit');


/**
 * Update GitHub topics from package.json.
 * @param {object} o options
 */
async function githubUpdateTopics(o) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.packageRoot||PACKAGE;
  var {names} = (await octokit.repos.getAllTopics({owner, repo})).data;
  var keywordsMin = o.keywordsMin||10;
  var names = o.keywords||jsonRead().keywords;
  names.length = Math.min(names.length, keywordsMin);
  names = names.map(n => n.toLowerCase().replace(/_/g, '-').replace(/[^\w-]/g, ''));
  var c = {owner, repo, names};
  console.log(`Topics: ${names.join(', ')}`);
  await octokit.repos.replaceAllTopics(c);
}
module.exports = githubUpdateTopics;
