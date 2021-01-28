const cpExec = require('./cpExec');


/**
 * Commit new changes.
 * @param m commit message (amend if empty)
 * @param o options (commit, push)
 */
function gitCommit(m='', o={}) {
  var o = Object.assign({commit: '', push: ''}, o);
  if (m) o.commit += ` -m "${m}"`;
  else o.commit += ` --amend --no-edit`;
  if (!m) o.push += ` -f`;
  cpExec(`git add .`, o);
  cpExec(`git commit${o.commit}`, o);
  cpExec(`git push${o.push}`, o);
}
module.exports = gitCommit;
