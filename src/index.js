const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const dirJsdocs = require('./dirJsdocs');
const exportJsdocs = require('./exportJsdocs');
const mdHeading = require('./mdHeading');
const doExport = require('./doExport');
const doWiki = require('./doWiki');
const doReadme = require('./doReadme');
const doExample = require('./doExample');
const doMeta = require('./doMeta');
const doGithub = require('./doGithub');
const doMain = require('./doMain');
const doPublish = require('./doPublish');
const symbolName = require('./symbolName');
const standaloneName = require('./standaloneName');
const urlPackage = require('./urlPackage');
const fs = require('fs');
const path = require('path');
const pathReplaceExt = require('./pathReplaceExt');

const CODE = ['exports', 'main'];
const DOCS = ['metadata', 'readme', 'example', 'wiki', 'github'];
const ALL = [...CODE, ...DOCS, 'publish'];


/**
 * Perform build operation(s).
 * @param {Array<string>} cmds commands to perform\
 * [exports, main, json, readme, example, wiki, github, publish]
 * @param {object} o options\
 * {readme, source, out}
 */
async function build(cmds, o) {
  var jsdocs = null;
  var c = initCmds(cmds);
  initPaths(o);
  initProps(o);
  if(c.readme || c.wiki) {
    initExample(o);
    jsdocs = new Map([
      ...exportJsdocs(o.source),
      ...dirJsdocs(o.sourceDir)
    ]);
  }
  if(c.exports) doExport(o.source, o);
  if(c.main) doMain(o.source, o);
  if(c.metadata) doMeta(o.metadata, o);
  if(c.readme) doReadme(o.readme, jsdocs, o);
  if(c.example) doExample(o.readme, o);
  if(c.wiki) doWiki(o.wikiDir, jsdocs, o);
  if(c.github) await doGithub(o);
  if(c.publish) doPublish(o);
  if (o.cleanup) cpExec(`rm -rf "${o.buildDir}"`);
}


function initCmds(cmds) {
  var a = {};
  if (cmds.includes('code')) cmds = [cmds, ...CODE];
  if (cmds.includes('docs')) cmds = [cmds, ...DOCS];
  if (cmds.includes('all')) cmds = ALL;
  for (var c of ALL)
    a[c] = cmds.includes(c);
  return a;
}


function initPaths(o) {
  o.readme = o.readme||'README.md';
  o.metadata = o.metadata||'package.json';
  o.tsconfig = o.tsconfig||'tsconfig.json';
  o.rollupconfig = o.rollupconfig||'rollup.config.js';
  o.source = o.source||'src/index.ts';
  var m = jsonRead(o.metadata);
  var tsc = jsonRead(o.tsconfig);
  o.sourceDir = o.sourceDir||path.dirname(o.source);
  o.keywordsDir = o.keywordsDir||o.sourceDir;
  o.buildDir = o.buildDir||tsc.outDir||'.build';
  o.build = path.join(o.buildDir, pathReplaceExt(path.basename(o.source), '.js'));
  o.jsdocDir = o.jsdocDir||path.join(o.buildDir, '.jsdoc');
  o.exampleDir = o.exampleDir||path.join(o.buildDir, '.example');
  o.out = o.out||m.main||'index.js';
  o.outDir = path.dirname(o.out);
  o.exampleOut = o.exampleOut||'example.js';
  o.cleanup = o.cleanup??true;
  fs.mkdirSync(o.buildDir, {recursive: true});
  fs.mkdirSync(o.jsdocDir, {recursive: true});
  fs.mkdirSync(o.exampleDir, {recursive: true});
  fs.mkdirSync(o.outDir, {recursive: true});
}


function initProps(o) {
  var m = jsonRead(o.metadata);
  var r = fileRead(o.readme);
  o.org = o.org||'nodef';
  o.name = o.name||m.name;
  o.symbol = o.symbol||symbolName(o.name);
  o.standalone = o.standalone||standaloneName(o.symbol);
  o.subname = o.name;
  o.subsymbol = o.symbol;
  o.substandalone = o.standalone;
  o.moduleName = o.moduleName??o.name;
  o.description = o.description||mdHeading(r)||m.description;
  o.homepage = o.homepage||m.homepage||urlPackage(o);
  o.keywordsMin = o.keywordsMin??10;
  o.asciinema = o.asciinema??true;
  // o.keywords = o.keywords||m.keywords;
}


function initExample(o) {
  var cwd = o.exampleDir;
  var m = jsonRead(o.metadata);
  var pkgs = Object.keys(m.devDependencies||{});
  pkgs = pkgs.filter(p => p !== 'extra-build');
  pkgs.push(o.packageRoot);
  cpExec('npm init -y', {cwd, stdio: null});
  cpExec('npm install '+pkgs.join(' '), {cwd});
}
module.exports = build;
