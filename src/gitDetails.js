const url = require('url');


/**
 * Get details from git URL.
 * @param {string} u remote url
 */
function gitDetails(u) {
  var p = url.parse(u).pathname.substring(1);
  var [owner, repo] = p.split('/');
  return {owner, repo};
}
module.exports = gitDetails;
