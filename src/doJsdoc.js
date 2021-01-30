const console = require('./console');
const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');
const gitRemoteUrl = require('./gitRemoteUrl');
const initJsdoc = require('./initJsdoc');
const optionStringify = require('./optionStringify');
const fs = require('fs');

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
  var pth = pth||'src/index.ts';
  var out = fs.mkdtempSync('.docs');
  var o = Object.assign({}, o, {out});
  var opts = optionStringify(o, getOption);
  console.log(`Publishing JSDoc ...`);
  cpExec(`npx typedoc "${pth}" ${opts}`);
  initJsdoc(o);
  cpExec(`rm -rf "${cwd}"`);
  var url = gitRemoteUrl();
  cpExec(`git clone ${url} "${cwd}"`);
  cpExec(`git checkout gh-pages`, {cwd});
  cpExec(`rm -rf *`, {cwd});
  cpExec(`mv "${out}"/* "${cwd}"/`);
  cpExec(`rm -rf "${out}"`);
  gitCommit('', {cwd});
}


function getOption(k) {
  if (k.startsWith('typedoc_')) return k.substring(8);
  return null;
}
module.exports = doJsdoc;
