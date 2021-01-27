/**
 * Get GitHub repo URL.
 * @param {object} o options {org, package}
 */
function urlRepo(o) {
  return `https://github.com/${o.org}/${o.packageRoot||o.package}`;
}
module.exports = urlRepo;
