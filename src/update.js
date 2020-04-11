const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const dirJsdocs = require('./dirJsdocs');
const updateExports = require('./updateExports');
const updateWiki = require('./updateWiki');
const updateReadme = require('./updateReadme');
const updateExample = require('./updateExample');
const updateJson = require('./updateJson');
const updateGithub = require('./updateGithub');
const updateSrc = require('./updateSrc');
const updateMain = require('./updateMain');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  symbol_root: SYMBOL
};


async function update(o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log('update:', o);
  var jsdocs = dirJsdocs();
  updateJson(o.json_path, o);
  updateReadme(o.readme_path, jsdocs, o);
  updateExample(o.example_path, o);
  updateWiki(o.wiki_path, jsdocs, o);
  updateExports(o.exports_path, o);
  updateMain(o.main_path, o);
  await updateGithub(o);
};
module.exports = update;
