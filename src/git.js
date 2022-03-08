const path = require('path');
const cp   = require('./child_process');




/**
 * Get remote URL.
 * @returns {string} remote URL
 */
function remoteUrl() {
  return cp.execStrSync(`git config --get remote.origin.url`);
}


/**
 * Get current branch.
 * @returns {string} branch name
 */
function branch() {
  return cp.execStrSync(`git rev-parse --abbrev-ref HEAD`);
}


/**
 * Get diff of a file.
 * @param {string} pth path of file
 * @returns {string} diff text
 */
function diff(pth) {
  var f   = path.basename(pth);
  var cwd = path.dirname(pth);
  return cp.execStrSync(`git diff "${f}"`, {cwd});
}


/**
 * Add submodule to repository.
 * @param {string} url submodule url
 * @param {string} out output directory
 */
function addSubmodule(url, out) {
  if (!url) { cp.execLogSync(`git submodule update --remote --merge`); return; }
  cp.execLogSync(`git submodule add ${url} "${out}"`);
  cp.execLogSync(`git submodule update --init`);
}


/**
 * @typedef CommitPushOptions
 * @prop {string} commit commit options
 * @prop {string} push push options
 * @prop {string} cwd current working directory
 */
/**
 * Commit new changes and push to remote.
 * @param {string} msg commit message (amend if empty)
 * @param {CommitPushOptions} o commit options
 */
function commitPush(msg='', o=null) {
  var o = Object.assign({commit: '', push: ''}, o);
  if (msg) o.commit += ` -m "${msg}"`;
  else o.commit += ` --amend --no-edit`;
  if (!msg) o.push += ` -f`;
  cp.execLogSync(`git add .`, o);
  cp.execLogSync(`git commit${o.commit}`, o);
  cp.execLogSync(`git push${o.push}`, o);
}


/**
 * @typedef SetupBranchOptions
 * @prop {string} file first file [index.html]
 * @prop {string} cwd current working directory
 */
/**
 * Setup new branch and push to remote.
 * @param {string} branch branch name
 * @param {SetupBranchOptions} o setup options
 *
 */
function setupBranch(branch, o=null) {
  var o = Object.assign({}, o);
  console.log(`Creating ${branch} branch ...`);
  cp.execLogSync(`git checkout --orphan ${branch}`, o);
  cp.execLogSync(`git rm -rf .`, o);
  cp.execLogSync(`git clean -fxd`, o);
  cp.execLogSync(`touch ${o.file || 'index.html'}`, o);
  var co = Object.assign({push: ` --set-upstream origin ${branch}`}, o);
  git.commitPush('initial commit', co);
}
module.exports = {
  branch, remoteUrl, diff,
  addSubmodule, commitPush, setupBranch
};
