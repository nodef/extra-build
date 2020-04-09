const org = require('./org');
const packageName = require('./packageName');
const jsonRead = require('./jsonRead');
const octokit = require('./octokit');


async function githubTopicsUpdate(o={}) {
  var owner = o.org||org;
  var repo = o.package_root||packageName;
  var names = await octokit.repos.getAllTopics({owner, repo});
  var keywords_min = o.keywords_min||5;
  if(names.length<keywords_min) {
    var names = o.keywords||jsonRead().keywords;
    name.length = Math.min(names.length, 20);
    var c = {owner, repo, names};
    console.log('githubTopicsUpdate:', c);
    await octokit.repos.replaceAllTopics(c);
  }
}
module.exports = githubTopicsUpdate;
