const path = require('path');
const cp   = require('./_child_process');




/**
 * Get remote URL.
 * @returns {string} remote URL
 */
 function remoteUrl() {
  return cp.execStr(`git config --get remote.origin.url`);
}


/**
 * Get current branch.
 * @returns {string} branch name
 */
function branch() {
  return cp.execStr(`git rev-parse --abbrev-ref HEAD`);
}


/**
 * Get diff of a file.
 * @param {string} pth path of file
 * @returns {string} diff text
 */
function diff(pth) {
  var f   = path.basename(pth);
  var cwd = path.dirname(pth);
  return cp.execStr(`git diff "${f}"`, {cwd});
}


/**
 * Add submodule to repository.
 * @param {string} url submodule url
 * @param {string} out output directory
 */
function addSubmodule(url, out) {
  if (!url) { cp.execLog(`git submodule update --remote --merge`); return; }
  cp.execLog(`git submodule add ${url} "${out}"`);
  cp.execLog(`git submodule update --init`);
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
 * @param {CommitPushOptions} o options {commit, push}
 */
function commitPush(msg='', o=null) {
  var o = Object.assign({commit: '', push: ''}, o);
  if (msg) o.commit += ` -m "${msg}"`;
  else o.commit += ` --amend --no-edit`;
  if (!msg) o.push += ` -f`;
  cp.execLog(`git add .`, o);
  cp.execLog(`git commit${o.commit}`, o);
  cp.execLog(`git push${o.push}`, o);
}
module.exports = {branch, remoteUrl, diff, addSubmodule, commitPush};
