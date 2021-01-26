const {Octokit} = require('@octokit/rest');

const E = process.env;
const octokit = new Octokit({
  auth: E.GITHUB_TOKEN
});
module.exports = octokit;
