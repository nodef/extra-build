const console = require('./console');
const octokit = require('./octokit');
const baseKeywords = require('./baseKeywords');


/**
 * Update GitHub topics from package.json.
 * @param {object} o options
 */
async function githubUpdateTopics(o) {
  var {owner, repo} = o;
  var names = baseKeywords(true, o);
  names.length = Math.min(names.length, o.keywordsMin);
  names = names.map(n => n.toLowerCase().replace(/_/g, '-').replace(/[^\w-]/g, ''));
  console.info(`Topics: ${names.join(', ')}`);
  await octokit.repos.replaceAllTopics({owner, repo, names});
}
module.exports = githubUpdateTopics;
