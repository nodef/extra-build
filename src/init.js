const initCi = require('./initCi');
const initTs = require('./initTs');
const initRollup = require('./initRollup');
const initGitignore = require('./initGitignore');
const initNpmignore = require('./initNpmignore');
const initJson = require('./initJson');
const initWiki = require('./initWiki');
const kleur = require('kleur');

const OPTIONS = {
  ci: {},
  ts: {},
  rollup: {},
  gitignore: {},
  npmignore: {},
  json: {},
  wiki: {}
};


function init(o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log(kleur.bold().magenta('init:'), o);
  if(o.ci) initCi(o.ciPath, o.ci);
  if(o.ts) initTs(o.tsPath, o.ts);
  if(o.rollup) initRollup(o.rollupPath, o.rollup);
  if(o.gitignore) initGitignore(o.gitignorePath, o.gitignore);
  if(o.npmignore) initNpmignore(o.npmignorePath, o.npmignore);
  if(o.json) initJson(o.jsonPath, o.json);
  if(o.wiki) initWiki(o.wikiDir, o.wiki);
}
module.exports = init;
