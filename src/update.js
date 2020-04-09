const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const dirJsdocs = require('./dirJsdocs');
const updateWiki = require('./updateWiki');
const updateReadme = require('./updateReadme');
const updateJson = require('./updateJson');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  package: PACKAGE,
  symbol_root: SYMBOL,
  symbol: SYMBOL
};


function update(o) {
  var o = Object.assign({}, OPTIONS, o);
  console.log('update:', o);
  var jsdocs = dirJsdocs();
  updateWiki(o.wiki_path, jsdocs, o);
  updateReadme(o.readme_path, jsdocs, o);
  updateJson(o.json_path, o);
};
module.exports = update;
