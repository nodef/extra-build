const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');
const gitRemoteUrl = require('./gitRemoteUrl');
const initJsdoc = require('./initJsdoc');
const optionStringify = require('./optionStringify');

const TYPEDOC = new Set([
  'categorizeByGroup', 'categoryOrder', 'defaultCategory', 'disableOutputCheck',
  'disableSources', 'emit', 'entryPoints', 'excludeExternals', 'excludeInternal',
  'excludeNotDocumented', 'excludePrivate', 'excludeProtected', 'excludeTags',
  'externalPattern', 'gaID', 'gaSite', 'gitRemote', 'gitRevision', 'hideGenerator',
  'includes', 'json', 'listInvalidSymbolLinks', 'logger', 'logLevel', 'markedOptions',
  'media', 'name', 'options', 'out', 'plugin', 'preserveWatchOutput', 'readme',
  'showConfig', 'theme', 'toc', 'tsconfig', 'watch'
]);


/**
 * Publish JSDoc on gh-pages branch.
 * @param {string} pth main typescript file path
 * @param {object} o options
 */
function doJsdoc(pth, o) {
  var {jsdocDir: cwd} = o;
  var o = Object.assign({}, o, {out: cwd});
  var pth = pth||'src/index.ts';
  var opts = optionStringify(o, k => TYPEDOC.has(k)? k : null);
  initJsdoc(o);
  cpExec(`rm -rf "${cwd}"`);
  var url = gitRemoteUrl();
  cpExec(`git clone ${url} "${cwd}"`);
  cpExec(`git checkout gh-pages`, {cwd});
  cpExec(`rm -rf *`, {cwd});
  cpExec(`npx typedoc "${pth}" ${opts}`);
  gitCommit('', {cwd});
}
module.exports = doJsdoc;
