/**
 * Get GitHub repo URL.
 * @param {object} o options {org, nameRoot}
 */
function urlRepo(o) {
  return `https://github.com/${o.org}/${o.nameRoot}`;
}
module.exports = urlRepo;
