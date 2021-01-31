const url = require('url');


/**
 * Get details from git URL.
 * @param {string} u remote url
 */
function gitDetails(u) {
  var p = url.parse(u).pathname;
  p = p.replace(/^\/|^.*?:/, '');
  p = p.replace(/\.git$/, '');
  var [owner, repo] = p.split('/');
  return {owner, repo};
}
module.exports = gitDetails;
