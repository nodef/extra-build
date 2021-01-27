const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const githubUpdateDetails = require('./githubUpdateDetails');
const githubUpdateTopics = require('./githubUpdateTopics');


/**
 * Update GitHub repo description, url, topics.
 * @param {options} o options
 */
function doGithub(o) {
  var o = o||{};
  var owner = o.org||ORG;
  var repo = o.packageRoot||PACKAGE;
  console.log(`Updating GitHub details for ${owner}/${repo} ...`);
  return Promise.all([
    githubUpdateDetails(o),
    githubUpdateTopics(o)
  ]);
}
module.exports = doGithub;
