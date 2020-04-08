const githubRepoUpdate = require('./githubRepoUpdate');
const githubTopicsUpdate = require('./githubTopicsUpdate');


async function githubUpdate(o) {
  await githubRepoUpdate(o);
  await githubTopicsUpdate(o);
}
module.exports = githubUpdate;
