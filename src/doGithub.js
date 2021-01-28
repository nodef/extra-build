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
  console.log(`Updating GitHub details for ${o.org}/${o.name} ...`);
  return Promise.all([
    githubUpdateDetails(o),
    githubUpdateTopics(o)
  ]);
}
module.exports = doGithub;
