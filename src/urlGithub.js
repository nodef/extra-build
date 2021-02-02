/**
 * Get GitHub packages URL for repo.
 * @param {object} o options
 */
function urlGithub(o) {
  return `https://github.com/orgs/${o.owner}/packages?repo_name=${o.repo}`;
}
module.exports = urlGithub;
