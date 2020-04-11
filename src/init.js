const initCi = require('./initCi');
const initTs = require('./initTs');
const initRollup = require('./initRollup');
const initGitignore = require('./initGitignore');
const initNpmignore = require('./initNpmignore');
const initWiki = require('./initWiki');

const OPTIONS = {
  ci: {},
  ts: {},
  rollup: {},
  gitignore: {},
  npmignore: {},
  wiki: {}
};


function init(o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log('init:', o);
  if(o.ci) initCi(o.ci_path, o.ci);
  if(o.ts) initTs(o.ts_path, o.ts);
  if(o.rollup) initRollup(o.rollup_path, o.rollup);
  if(o.gitignore) initGitignore(o.gitignore_path, o.gitignore);
  if(o.npmignore) initNpmignore(o.npmignore_path, o.npmignore);
  if(o.wiki) initWiki(o.wiki_path, o.wiki);
}
module.exports = init;
