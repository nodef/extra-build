const cpExec = require('./cpExec');


/**
 * Commit new changes.
 * @param m commit message (amend if empty)
 * @param opt options (commit, push)
 */
function gitCommit(m='', opt={}) {
  var o = Object.assign({commit: '', push: ''}, opt);
  if (m) o.commit += ` -m "${m}"`;
  else o.commit += ` --amend --no-edit`;
  if (m) o.push += ` -f`;
  cpExec(`git add .`);
  cpExec(`git commit${o.commit}`)
  cpExec(`git push${o.push}`);
}
module.exports = gitCommit;
