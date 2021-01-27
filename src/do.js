const ORG = require('./ORG');
const PACKAGE = require('./PACKAGE');
const SYMBOL = require('./SYMBOL');
const cpExec = require('./cpExec');
const dirJsdocs = require('./dirJsdocs');
const jsonRead = require('./jsonRead');
const exportJsdocs = require('./exportJsdocs');
const doExport = require('./doExport');
const doWiki = require('./doWiki');
const doReadme = require('./doReadme');
const doExample = require('./doExample');
const doJson = require('./doJson');
const doGithub = require('./doGithub');
const doMain = require('./doMain');
const kleur = require('kleur');
const tempy = require('tempy');

const OPTIONS = {
  org: ORG,
  packageRoot: PACKAGE,
  symbolRoot: SYMBOL,
  asciinema: true,
  code: true,
  docs: true
};


function update(o) {
  var cwd = tempy.directory(), jsdocs = null;
  var o = Object.assign({exampleDir: cwd}, OPTIONS, o);
  console.log(kleur.bold().magenta('update:'), o);
  if(o.docs || o.readme || o.wiki) {
    var pkgs = Object.keys(jsonRead().devDependencies||{});
    pkgs = pkgs.filter(p => p!=='extra-build');
    pkgs.push(o.packageRoot);
    cpExec('npm init -y', {cwd, stdio: null});
    cpExec('npm install '+pkgs.join(' '), {cwd});
    jsdocs = new Map([
      ...exportJsdocs(o.exportsPath),
      ...dirJsdocs(o.srcDir)
    ]);
    console.log();
  }
  if(o.code || o.exports) doExport(o.exportsPath, o);
  if(o.code || o.main) doMain(o.mainPath, o);
  if(o.docs || o.json) doJson(o.jsonPath, o);
  if(o.docs || o.readme) doReadme(o.readmePath, jsdocs, o);
  if(o.docs || o.example) doExample(o.examplePath, o);
  if(o.docs || o.wiki) doWiki(o.wikiDir, jsdocs, o);
  if(o.docs || o.github) return doGithub(o);
  return Promise.resolve();
};
module.exports = update;
