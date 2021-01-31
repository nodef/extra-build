const console = require('./console');
const octokit = require('./octokit');


/**
 * Update GitHub description, homepage from README.
 * @param {object} o options
 */
async function githubUpdateDetails(o) {
  var {owner, repo, description, homepage} = o;
  console.info(`Description: ${description}`);
  console.info(`Website: ${homepage}`);
  await octokit.repos.update({owner, repo, description, homepage});
}
module.exports = githubUpdateDetails;
