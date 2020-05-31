const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const jsonRead = require('./jsonRead');
const octokit = require('./octokit');


async function githubTopicsUpdate(o) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.package_root||PACKAGE;
  var names = await octokit.repos.getAllTopics({owner, repo});
  var keywords_min = o.keywords_min||10;
  if(names.length<keywords_min) {
    var names = o.keywords||jsonRead().keywords;
    name.length = Math.min(names.length, keywords_min);
    var c = {owner, repo, names};
    console.log('githubTopicsUpdate:', c);
    await octokit.repos.replaceAllTopics(c);
  }
}
module.exports = githubTopicsUpdate;
