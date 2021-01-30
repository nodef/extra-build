const console = require('./console');
const octokit = require('./octokit');


/**
 * Update GitHub description, homepage from README.
 * @param {object} o options
 */
async function githubUpdateDetails(o) {
  var {org: owner, nameRoot: repo, description, homepage} = o;
  console.log(`Description: ${description}`);
  console.log(`Website: ${homepage}`);
  await octokit.repos.update({owner, repo, description, homepage});
}
module.exports = githubUpdateDetails;
