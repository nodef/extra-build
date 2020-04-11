const githubRepoUpdate = require('./githubRepoUpdate');
const githubTopicsUpdate = require('./githubTopicsUpdate');


async function updateGithub(o) {
  var o = o||{};
  console.log('updateGithub:', o);
  await githubRepoUpdate(o);
  await githubTopicsUpdate(o);
}
module.exports = updateGithub;
