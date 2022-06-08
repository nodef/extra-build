const fs = require('fs');
const javascript = require('extra-javascript-text');
const build = require('./');


const owner  = 'nodef';
const srcts  = 'index.ts';



// Is given file a submodule?
function isSubmodule(pth) {
  if (/^_|index.ts$/.test(pth)) return false;
  if (!/\.ts$/.test(pth)) return false;
  return true;
}


// Get filename keywords for main/sub package.
function filenameKeywords(fil) {
  if (fil !== srcts) return [build.symbolname(fil)];
  return fs.readdirSync('src').filter(isSubmodule).map(build.keywordname);
}


// Get export keywords for main/sub package.
function exportKeywords(fil) {
  var txt  = build.readFileText(`src/${fil}`);
  var exps = javascript.exportSymbols(txt);
  return exps.map(e => build.symbolname(e.name));
}


// Get keywords for main/sub package.
function keywords(fil) {
  var m = build.readMetadata('.');
  var s = new Set([...m.keywords, ...filenameKeywords(fil), ...exportKeywords(fil)]);
  return Array.from(s);
}


// Generate main output files.
function generateMain(fil, sym) {
  var env = sym? {TYPE: 'web'} : null;
  build.bundleScript(`.build/${srcts}`, {env});
  if (sym) build.webifyScript(`index.js`,  `index.js`,  {format: 'cjs', symbol: sym});
  if (sym) build.webifyScript(`index.mjs`, `index.mjs`, {format: 'esm', symbol: sym});
}


// Publish root package to NPM, GitHub.
function publishRoot(sym, ver) {
  var _package = build.readDocument('package.json');
  var m = build.readMetadata();
  m.version  = ver;
  m.keywords = keywords(srcts);
  if (sym) { m.name += '.web'; }
  var _readme  = build.readDocument('README.md');
  var txt = build.readFileText('README.md');
  if (sym) txt = txt.replace(/\[Files\]\((.*?)\/\)/g, '[Files]($1.web/)');
  build.writeFileText('README.md', txt);
  build.writeMetadata('.', m);
  build.publish('.');
  try { build.publishGithub('.', owner); }
  catch {}
  build.writeDocument(_readme);
  build.writeDocument(_package);
}


// Deploy root package to NPM, GitHub.
function deployRoot(ver) {
  var m   = build.readMetadata();
  var sym = build.symbolname(m.name);
  generateMain(srcts, '');
  publishRoot('', ver);
  // generateMain(srcts, sym);
  // publishRoot(sym, ver);
}


// Deploy root, sub packages to NPM, GitHub.
function deployAll() {
  var m   = build.readMetadata();
  var ver = build.nextUnpublishedVersion(m.name, m.version);
  build.exec(`tsc`);
  build.updateGithubRepoDetails();
  build.generateDocs(`src/${srcts}`);
  build.publishDocs();
  deployRoot(ver);
  // deploySub(ver);
}


// Generate wiki for all exported symbols.
function generateWiki() {
  createWikiFiles();
  generateWikiFiles();
}


// Update markdowns README, wiki.
function updateMarkdown(dm) {
  var txt = build.readFileText('README.md');
  build.markdownReindex(txt, dm);
  build.markdownUpdateLinkReferences(txt, dm, {owner});
  build.writeFileText('README.md');
}


function main(a) {
  var p  = build.loadDocs([`src/${srcts}`]);
  var ds = p.children.map(build.docsDetails);
  var dm = new Map(ds.map(d => [d.name, d]));
  if (a[2] === 'deploy') deployAll();
  else if (a[2] === 'wiki') generateWiki();
  else if (a[2] === 'markdown') updateMarkdown(dm);
  else generateMain(srcts, '');
}
main(process.argv);
