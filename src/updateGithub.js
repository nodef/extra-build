const githubRepoUpdate = require('./githubRepoUpdate');
const githubTopicsUpdate = require('./githubTopicsUpdate');
const kleur = require('kleur');


function updateGithub(o) {
  var o = o||{};
  console.log(kleur.cyan('updateGithub:'));
  return Promise.all([
    githubRepoUpdate(o),
    githubTopicsUpdate(o)
  ]);
}
module.exports = updateGithub;
