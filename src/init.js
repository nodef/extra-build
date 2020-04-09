const initCi = require('./initCi');
const initTs = require('./initTs');
const initRollup = require('./initRollup');
const initGitignore = require('./initGitignore');
const initNpmignore = require('./initNpmignore');
const initWiki = require('./initWiki');

function init(o) {
  var o = o||{};
  console.log('init:', o);
  initCi(o.ci_path, o);
  initTs(o.ts_path, o);
  initRollup(o.rollup_path, o);
  initGitignore(o.gitignore_path, o);
  initNpmignore(o.npmignore_path, o);
  initWiki(o.wiki_path, o);
}
module.exports = init;
