const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const cpExec = require('./cpExec');
const dirJsdocs = require('./dirJsdocs');
const updateExports = require('./updateExports');
const updateWiki = require('./updateWiki');
const updateReadme = require('./updateReadme');
const updateExample = require('./updateExample');
const updateJson = require('./updateJson');
const updateGithub = require('./updateGithub');
const updateMain = require('./updateMain');
const tempy = require('tempy');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  symbol_root: SYMBOL,
  json: true,
  readme: true,
  example: true,
  wiki: true,
  exports: true,
  main: true,
  github: true
};


async function update(o) {
  var cwd = tempy.directory();
  cpExec('npm init -y', {cwd});
  cpExec('npm install '+o.package_root, {cwd});
  var o = Object.assign({example_dir: cwd}, OPTIONS, o);
  console.log('update:', o);
  var jsdocs = dirJsdocs();
  if(o.json) updateJson(o.json_path, o);
  if(o.readme) updateReadme(o.readme_path, jsdocs, o);
  if(o.example) updateExample(o.example_path, o);
  if(o.wiki) updateWiki(o.wiki_path, jsdocs, o);
  if(o.exports) updateExports(o.exports_path, o);
  if(o.main) updateMain(o.main_path, o);
  if(o.github) await updateGithub(o);
};
module.exports = update;
