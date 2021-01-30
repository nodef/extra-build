const console = require('./console');
const octokit = require('./octokit');


/**
 * Update GitHub topics from package.json.
 * @param {object} o options
 */
async function githubUpdateTopics(o) {
  var {org: owner, nameRoot: repo, keywords: names} = o;
  names.length = Math.min(names.length, o.keywordsMin);
  names = names.map(n => n.toLowerCase().replace(/_/g, '-').replace(/[^\w-]/g, ''));
  console.info(`Topics: ${names.join(', ')}`);
  await octokit.repos.replaceAllTopics({owner, repo, names});
}
module.exports = githubUpdateTopics;
