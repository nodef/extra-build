const {URL} = require('url');




/**
 * @typedef UrlDetails
 * @prop {string} owner owner name
 * @prop {string} repo repository name
 */
/**
 * Get details from github URL.
 * @param {string} url remote url
 * @returns {UrlDetails} url details
 */
function urlDetails(url) {
  var p = new URL(url).pathname;
  p = p.replace(/^\/|^.*?:/, '');
  p = p.replace(/\.git$/, '');
  var [owner, repo] = p.split('/');
  return {owner, repo};
}
module.exports = {urlDetails};
