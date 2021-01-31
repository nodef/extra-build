const console = require('./console');
const githubUpdateDetails = require('./githubUpdateDetails');
const githubUpdateTopics = require('./githubUpdateTopics');


/**
 * Update GitHub repo description, url, topics.
 * @param {options} o options
 */
function doGithub(o) {
  var o = o||{};
  console.log(`Updating GitHub details for ${o.owner}/${o.repo} ...`);
  return Promise.all([
    githubUpdateDetails(o),
    githubUpdateTopics(o)
  ]);
}
module.exports = doGithub;
