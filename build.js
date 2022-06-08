const build = require('./');

const owner  = 'nodef';
const srcts  = 'index.ts';



// Get keywords for main/sub package.
function keywords(dm) {
  var m = build.readMetadata('.');
  var k = [...dm.values()].map(d => d.name);
  var s = new Set([...m.keywords, ...k]);
  return Array.from(s);
}


// Publish root package to NPM, GitHub.
function publishRoot(dm, sym, ver) {
  var _package = build.readDocument('package.json');
  var m = build.readMetadata();
  m.version  = ver;
  m.keywords = keywords(dm);
  if (sym) { m.name += '.web'; }
  build.writeMetadata('.', m);
  build.publish('.');
  try { build.publishGithub('.', owner); }
  catch {}
  build.writeDocument(_package);
}


// Deploy root package to NPM, GitHub.
function deployRoot(dm, ver) {
  // generateMain(srcts, '');
  publishRoot(dm, '', ver);
}


// Deploy root, sub packages to NPM, GitHub.
function deployAll(dm) {
  var m   = build.readMetadata();
  var ver = build.nextUnpublishedVersion(m.name, m.version);
  // build.exec(`tsc`);
  build.updateGithubRepoDetails();
  build.generateDocs(`src/${srcts}`);
  build.publishDocs();
  deployRoot(dm, ver);
  // deploySub(ver);
}


// Generate wiki for all exported symbols.
function generateWiki() {
  // createWikiFiles();
  // generateWikiFiles();
}


// Update README.
function updateReadme(dm) {
  var txt = build.readFileText('README.md');
  txt = build.wikiUpdateIndex(txt, dm);
  txt = build.wikiUpdateLinkReferences(txt, dm, {owner});
  build.writeFileText('README.md', txt);
}


function main(a) {
  var p  = build.loadDocs([`src/${srcts}`]);
  var ds = p.children.map(build.docsDetails);
  var dm = new Map(ds.map(d => [d.name, d]));
  if (a[2] === 'deploy') deployAll(dm);
  else if (a[2] === 'wiki') generateWiki(dm);
  else if (a[2] === 'readme') updateReadme(dm);
}
main(process.argv);
