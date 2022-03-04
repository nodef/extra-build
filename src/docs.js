const option  = require('./_option');
const console = require('./_console');
const cp      = require('./_child_process');
const git     = require('./_git');




/**
 * Translate typedoc option keys.
 * @param {string} k key name
 * @returns {string} new key name
 */
function typedocOption(k) {
  if (k.startsWith('typedoc_')) return k.substring(8);
  if (k === 'out') return 'out';
  return null;
}


/**
 * Generate docs from source typescript file.
 * @param {string} src source typescript file [src/index.ts]
 * @param {string} doc output docs directory [.docs]
 * @param {object} o typedoc options
 */
function generate(src='src/index.ts', doc='.docs', o=null) {
  var o    = Object.assign({out: doc}, o);
  var opts = option.stringify(o, typedocOption);
  console.log(`Generating docs from ${src} at ${doc} ...`);
  cpExec(`npx typedoc "${src}" ${opts}`);
}


/**
 * Setup branch for docs.
 * @param {string} branch branch name [gh-pages]
 * @param {string} out output directory [.]
 */
function setupBranch(branch='gh-pages', out='.') {
  var cwd = out;
  console.log(`Creating ${branch} branch ...`);
  cp.exec(`git checkout --orphan ${branch}`, {cwd});
  cp.exec(`git rm -rf .`, {cwd});
  cp.exec(`git clean -fxd`, {cwd});
  cp.exec(`touch index.html`, {cwd});
  git.commitPush('initial commit', {push: ' --set-upstream origin gh-pages', cwd})
}


/**
 * Publish branch for docs from docs directory.
 * @param {string} doc docs directory [.docs]
 * @param {string} branch branch name [gh-pages]
 * @param {string} pub relative publish directory [.]
 */
function publish(doc='.docs', branch='gh-pages', pub='.') {
  console.log(`Publishing JSDoc from ${doc} to ${pub} in branch ${branch} ...`);
  var url = git.remoteUrl();
  var cwd = '.docs-publish';
  var out = path.join(cwd, pub);
  cp.exec(`git clone ${url} "${cwd}"`);
  try { cp.exec(`git checkout ${branch}`, {cwd}); }
  catch (e) { setupBranch(branch, out); }
  cp.exec(`rm -rf *`, {cwd: out});
  cp.exec(`cp "${doc}"/* "${out}"/`);
  git.commitPush('', {cwd});
  cp.exec(`rm -rf "${pub}"`, {cwd});
}
module.exports = {generate, publish};
