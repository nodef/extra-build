const githubUpdateDetails = require('./githubUpdateDetails');
const githubUpdateTopics = require('./githubUpdateTopics');


function updateGithub(o) {
  var o = o||{};
  return Promise.all([
    githubUpdateDetails(o),
    githubUpdateTopics(o)
  ]);
}
module.exports = updateGithub;
