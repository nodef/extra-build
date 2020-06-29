const githubRepoUpdate = require('./githubRepoUpdate');
const githubTopicsUpdate = require('./githubTopicsUpdate');


function updateGithub(o) {
  var o = o||{};
  console.log('updateGithub:');
  return Promise.all([
    githubRepoUpdate(o),
    githubTopicsUpdate(o)
  ]);
}
module.exports = updateGithub;
