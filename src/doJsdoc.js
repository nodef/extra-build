const cpExec = require('./cpExec');
const gitCommit = require('./gitCommit');
const gitBranch = require('./gitBranch');
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
  var o = Object.assign({}, o, {out: dir});
  var pth = pth||o.sourcePath||'src/index.ts';
  var opts = optionStringify(o, k => TYPEDOC.has(k)? k : null);
  var dir = fs.mkdtempSync('docs');
  var main = gitBranch();
  initJsdoc();
  cpExec(`npx typedoc "${pth}" ${opts}`);
  cpExec(`git checkout gh-pages`);
  cpExec(`cp -rf "${dir}"/* ./`);
  cpExec(`rm -rf ${dir}`);
  gitCommit('');
  cpExec(`git checkout ${main}`);
}
module.exports = doJsdoc;
