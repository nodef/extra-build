const githubUpdateDetails = require('./githubUpdateDetails');
const githubUpdateTopics = require('./githubUpdateTopics');


/**
 * Update GitHub repo description, url, topics.
 * @param {options} opt options
 */
function doGithub(opt) {
  var o = opt||{};
  return Promise.all([
    githubUpdateDetails(o),
    githubUpdateTopics(o)
  ]);
}
module.exports = doGithub;
