const cpExec = require('./cpExec');
const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const dirJsdocs = require('./dirJsdocs');
const pathReplaceExt = require('./pathReplaceExt');
const gitRemoteUrl = require('./gitRemoteUrl');
const gitDetails = require('./gitDetails');
const exportJsdocs = require('./exportJsdocs');
const mdHeading = require('./mdHeading');
const doExport = require('./doExport');
const doWiki = require('./doWiki');
const doJsdoc = require('./doJsdoc');
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

const CODE = ['export', 'main'];
const DOCS = ['meta', 'readme', 'example', 'jsdoc', 'wiki', 'github'];
const ALL = [...CODE, ...DOCS, 'publish'];


/**
 * Perform build operation(s).
 * @param {Array<string>} cmds commands to perform\
 * [export, main, json, readme, example, wiki, github, publish]
 * @param {object} o options\
 * {readme, source, out}
 */
async function build(cmds, o) {
  var jsdocs = null;
  var c = initCmds(cmds);
  initPaths(o);
  initProps(o);
  if (c.readme || c.wiki) {
    jsdocs = new Map([
      ...exportJsdocs(o.source),
      ...dirJsdocs(o.sourceDir)
    ]);
  }
  if (c.jsdoc) doJsdoc(o.source, o);
  if (c.export) doExport(o.source, o);
  if (c.main) doMain(o.source, o);
  if (c.meta) doMeta(o.meta, o);
  if (c.readme) doReadme(o.readme, jsdocs, o);
  if (c.example) doExample(o.readme, o);
  if (c.wiki) doWiki(o.wikiDir, jsdocs, o);
  if (c.github) await doGithub(o);
  if (c.publish) doPublish(o);
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
  o.meta = o.meta||'package.json';
  o.npmrc = o.npmrc||'.npmrc';
  o.readme = o.readme||'README.md';
  o.tsconfig = o.tsconfig||'tsconfig.json';
  o.rollupconfig = o.rollupconfig||'rollup.config.js';
  o.source = o.source||'src/index.ts';
  var m = jsonRead(o.meta);
  var tsc = jsonRead(o.tsconfig);
  o.sourceDir = o.sourceDir||path.dirname(o.source);
  o.modulesDir = o.modulesDir||'node_modules';
  o.wikiDir = o.wikiDir||'wiki';
  o.keywordsDir = o.keywordsDir||o.sourceDir;
  o.buildDir = o.buildDir||tsc.outDir||'.build';
  o.build = path.join(o.buildDir, pathReplaceExt(path.basename(o.source), '.js'));
  o.jsdocDir = o.jsdocDir||path.join(o.buildDir, 'jsdoc');
  o.asciinemaDir = o.asciinemaDir||path.join(o.buildDir, 'example');
  o.outEs = o.outEs||m.module||'index.mjs';
  o.outJs = o.outJs||m.main||'index.js';
  o.outDts = o.outDts||pathReplaceExt(o.outJs, '.d.ts');
  o.out = o.out||o.outJs;
  o.outDir = path.dirname(o.out);
  o.example = o.example||'example.js';
  o.cleanup = o.cleanup??true;
  fs.mkdirSync(o.buildDir, {recursive: true});
  fs.mkdirSync(o.jsdocDir, {recursive: true});
  fs.mkdirSync(o.asciinemaDir, {recursive: true});
  fs.mkdirSync(o.outDir, {recursive: true});
}


function initProps(o) {
  var m = jsonRead(o.meta);
  var r = fileRead(o.readme);
  o.repoUrl = o.repoUrl||gitRemoteUrl();
  o.wikiUrl = o.wikiUrl||`${o.repoUrl}.wiki`;
  o.owner = o.owner||gitDetails(o.repoUrl).owner;
  o.repo = o.repo||gitDetails(o.repoUrl).repo;
  o.name = o.name||m.name;
  o.symbol = o.symbol||symbolName(o.name);
  o.standalone = o.standalone||standaloneName(o.symbol);
  o.nameRoot = o.name;
  o.symbolRoot = o.symbol;
  o.standaloneRoot = o.standalone;
  o.moduleName = o.moduleName??o.name;
  o.description = o.description||mdHeading(r)||m.description;
  o.homepage = o.homepage||(/github/.test(m.homepage)? urlPackage(o) : m.homepage);
  o.keywordsMin = o.keywordsMin??10;
  o.asciinema = o.asciinema??false;
  o.metaDescription = o.metaDescription??true;
  o.metaVersion = o.metaVersion??true;
  o.metaKeywords = o.metaKeywords??true;
  o.readmeIndex = o.readmeIndex??true;
  o.readmeLinks = o.readmeLinks??true;
  o.readmeHeader = o.readmeHeader||'heavy';
  o.readmeAsciinema = o.readmeAsciinema??false;
  o.exampleComments = o.exampleComments??false;
  o.wikiDescription = o.wikiDescription??true;
  o.wikiDescriptionSymbol = o.wikiDescriptionSymbol??'short';
  o.wikiHeader = o.wikiHeader||'heavy';
  o.wikiDefinition = o.wikiDefinition??true;
  o.wikiExample = o.wikiExample??true;
  o.wikiLinks = o.wikiLinks??true;
  o.wikiAsciinema = o.wikiAsciinema??false;
  o.publishMin = o.publishMin??true;
  o.publishBranch = o.publishBranch??true;
  o.publishGithub = o.publishGithub??true;
  o.jsdocWiki = o.jsdocWiki??true;
  o.jsdocExample = o.jsdocExample??true;
  o.jsdocExampleRequire = o.jsdocExampleRequire??false;
  o.jsdocExampleSymbol = o.jsdocExampleSymbol??false;
  // o.keywords = o.keywords||m.keywords;
}
module.exports = build;
