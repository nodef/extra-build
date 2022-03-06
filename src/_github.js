const {URL} = require('url');
const {Octokit} = require('@octokit/rest');
const console = require('./_console');




/**
 * @typedef UrlDetails
 * @prop {string} owner owner name
 * @prop {string} repo repository name
 */
/**
 * Get details from GitHub URL.
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


/**
 * @typedef RepositoryDetails
 * @prop {string?} auth github token
 * @prop {string} description repository description
 * @prop {string} homepage repository homepage URL
 * @prop {string[]} topics repository topics (keywords)
 */
/**
 * Update GitHub repository details.
 * @param {string} owner owner name
 * @param {string} repo repository name
 * @param {RepositoryDetails} o repository details
 */
function updateDetails(owner, repo, o=null) {
  var E = process.env;
  var {description, homepage, topics} = Object.assign({}, o);
  var octokit = new Octokit({auth: o.auth || E.GITHUB_TOKEN});
  console.info('Updating GitHub details:\n');
  console.info(`Description: ${description || ''}`);
  console.info(`Website: ${homepage || ''}`);
  await octokit.repos.update({owner, repo, description, homepage});
  console.info(`Topics: ${(topics || []).join(', ')}`);
  await octokit.repos.update({owner, repo, names: topics});
}
module.exports = {urlDetails, updateDetails};
