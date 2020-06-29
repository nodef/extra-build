const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const cpExec = require('./cpExec');
const dirJsdocs = require('./dirJsdocs');
const jsonRead = require('./jsonRead');
const exportsJsdocs = require('./exportsJsdocs');
const updateExports = require('./updateExports');
const updateWiki = require('./updateWiki');
const updateReadme = require('./updateReadme');
const updateExample = require('./updateExample');
const updateJson = require('./updateJson');
const updateGithub = require('./updateGithub');
const updateMain = require('./updateMain');
const kleur = require('kleur');
const tempy = require('tempy');

const OPTIONS = {
  org: ORG,
  package_root: PACKAGE,
  symbol_root: SYMBOL,
  asciinema: true,
  code: true,
  docs: true
};


function update(o) {
  var cwd = tempy.directory(), jsdocs = null;
  var o = Object.assign({example_dir: cwd}, OPTIONS, o);
  console.log(kleur.magenta('update:'), o);
  if(o.docs || o.readme || o.wiki) {
    var pkgs = Object.keys(jsonRead().devDependencies||{});
    pkgs = pkgs.filter(p => p!=='extra-build');
    pkgs.push(o.package_root);
    cpExec('npm init -y', {cwd, stdio: null});
    cpExec('npm install '+pkgs.join(' '), {cwd});
    jsdocs = new Map([
      ...exportsJsdocs(o.exports_path),
      ...dirJsdocs(o.src_dir)
    ]);
    console.log();
  }
  if(o.code || o.exports) updateExports(o.exports_path, o);
  if(o.code || o.main) updateMain(o.main_path, o);
  if(o.docs || o.json) updateJson(o.json_path, o);
  if(o.docs || o.readme) updateReadme(o.readme_path, jsdocs, o);
  if(o.docs || o.example) updateExample(o.example_path, o);
  if(o.docs || o.wiki) updateWiki(o.wiki_dir, jsdocs, o);
  if(o.docs || o.github) return updateGithub(o);
  return Promise.resolve();
};
module.exports = update;
