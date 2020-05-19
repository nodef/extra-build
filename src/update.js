const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const cpExec = require('./cpExec');
const dirJsdocs = require('./dirJsdocs');
const exportsJsdocs = require('./exportsJsdocs');
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
  code: true,
  docs: true
};


async function update(o) {
  var cwd = tempy.directory(), jsdocs = null;
  var o = Object.assign({example_dir: cwd}, OPTIONS, o);
  console.log('update:', o);
  if(o.docs || o.readme || o.wiki) {
    cpExec('npm init -y', {cwd});
    cpExec('npm install '+o.package_root, {cwd});
    jsdocs = new Map([
      ...exportsJsdocs(o.exports_path),
      ...dirJsdocs(o.src_dir)
    ]);
  }
  if(o.code || o.exports) updateExports(o.exports_path, o);
  if(o.code || o.main) updateMain(o.main_path, o);
  if(o.docs || o.json) updateJson(o.json_path, o);
  if(o.docs || o.readme) updateReadme(o.readme_path, jsdocs, o);
  if(o.docs || o.example) updateExample(o.example_path, o);
  if(o.docs || o.wiki) updateWiki(o.wiki_dir, jsdocs, o);
  if(o.docs || o.github) await updateGithub(o);
};
module.exports = update;
