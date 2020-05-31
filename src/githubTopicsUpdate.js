const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const jsonRead = require('./jsonRead');
const octokit = require('./octokit');


async function githubTopicsUpdate(o) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.package_root||PACKAGE;
  var {names} = (await octokit.repos.getAllTopics({owner, repo})).data;
  var keywords_min = o.keywords_min||10;
  var names = o.keywords||jsonRead().keywords;
  names.length = Math.min(names.length, keywords_min);
  names = names.map(n => n.toLowerCase().replace(/_/g, '-').replace(/[^\w-]/g, ''));
  var c = {owner, repo, names};
  console.log('githubTopicsUpdate:', c);
  await octokit.repos.replaceAllTopics(c);
}
module.exports = githubTopicsUpdate;
