const fs = require('fs');
const javascript = require('extra-javascript-text');
const jsdoc      = require('extra-jsdoc-text');
const markdown   = require('extra-markdown-text');
const build = require('./');


const owner  = 'nodef';
const srcts  = 'index.ts';
const outjs  = 'index.js';
const outmjs = 'index.mjs';
const outdts = 'index.d.ts';



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


// Webify output files.
function webifyMain(sym) {
  build.exec(`browserify "${outjs}" -o "${outjs}.1" -s ${sym}`);
  build.exec(`cp "${outmjs}" "${outmjs}.1"`);
  build.exec(`terser "${outjs}.1" -o "${outjs}"  -c -m`);
  build.exec(`terser "${outmjs}.1" -o "${outmjs}" -c -m`);
  build.exec(`rm -f "${outjs}.1"`);
  build.exec(`rm -f "${outmjs}.1"`);
}


// Generate main output files.
function generateMain(fil, sym) {
  var bld = fil.replace(/\.ts/, '.js');
  var env = sym? ` --environment TYPE:web` : '';
  build.exec(`rollup -c rollup.config.js -i .build/${bld}` + env);
  if (sym) webifyMain(sym);
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


// Get sub package description.
function subDescription(nam) {
  if (!fs.existsSync(`wiki/${nam}.md`)) return '';
  var txt = build.readFileText(`wiki/${nam}.md`);
  return txt.replace(/\n[\s\S]*/g, '').replace(/<br>/g, '');
}


// Publish sub package to NPM, GitHub.
function publishSub(nam, sym, ver) {
  var _package = build.readDocument('package.json');
  var m    = build.readMetadata();
  var desc = `${m.description.slice(0, -1)} {${nam}}.`;
  m.name   = `@${m.name}/${nam}`;
  m.description = subDescription(nam) || desc;
  m.version  = ver;
  m.keywords = keywords(`${nam}.ts`);
  if (sym) { m.name += '.web'; }
  var _readme  = build.readDocument('README.md');
  var txt = build.readFileText('README.md');
  if (sym) txt = txt.replace(/\[Files\]\((.*?)\/\)/g, '[Files]($1.web/)');
  build.writeFileText('README.md', txt);
  build.writeMetadata('.', m);
  build.publish('.');
  build.publishGithub('.', owner);
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


// Get markdown for JSDoc symbol.
function jsdocSymbolMarkdown(sym, pre, repo) {
  var x   = jsdoc.parse(sym.jsdoc);
  var nam = pre? `${pre}.${sym.name}`   : sym.name;
  var pkg = pre? `@${repo}/${sym.name}` : repo;
  var sig = `${nam}(${x.params.map(p => p.name).join(', ')})`;
  var len = Math.max(...x.params.map(p => p.name.length)) + 2;
  var par = x.params.map(p => `// ${(p.name+':').padEnd(len, ' ')}${p.description}`).join('\n');
  return `${x.description}<br>\n` +
    `📦 [NPM](https://www.npmjs.com/package/${pkg}),\n` +
    `🌐 [Web](https://www.npmjs.com/package/${pkg}.web),\n` +
    `📜 [Files](https://unpkg.com/${pkg}/),\n` +
    `📰 [Docs](https://nodef.github.io/${repo}/).\n\n` +
    `> Similar: [${nam}].\n\n` +
    `<br>\n\n` +
    '```javascript\n' +
    `${sig};\n` +
    `${par}\n` +
    '```\n\n' +
    '```javascript\n' +
    `const ${nam} = require("${repo}");\n\n` +
    `${nam}(...);\n` +
    `// → OUTPUT\n` +
    '```\n\n' +
    '<br>\n' +
    '<br>\n\n\n' +
    `## References\n\n` +
    `- [Example](https://www.example.com/)\n\n` +
    `[${nam}]: https://github.com/${owner}/${repo}/wiki/${nam}\n`
}


// Process each source file.
function forEachSourceFile(fn) {
  for (var f of fs.readdirSync('src')) {
    if (f.startsWith('_')) continue;
    var txt = build.readFileText(`src/${f}`);
    var exps = javascript.exportSymbols(txt);
    var docs = javascript.jsdocSymbols(txt);
    var dmap = new Map(docs.map(x => [x.name, x]));
    fn(f, exps, dmap);
  }
}


// Create empty wiki files for all exported symbols.
function createWikiFiles() {
  forEachSourceFile((f, exps) => {
    var nam = f.replace(/\..*/, '');
    var pre = f === 'index.ts'? '' : nam;
    for (var e of exps) {
      var out = `wiki/${pre}${e.name}.md`;
      if (fs.existsSync(out)) continue;
      build.writeFileText(out, '');
    }
  });
}


// Generate wiki file text for all exported symbols.
function generateWikiFiles() {
  var m = build.readMetadata('.');
  forEachSourceFile((f, exps, dmap) => {
    var nam = f.replace(/\..*/, '');
    var pre = f === 'index.ts'? '' : nam;
    for (var e of exps) {
      var out = `wiki/${pre}${e.name}.md`;
      if (!fs.existsSync(out)) continue;
      if (build.readFileText(out).length > 0) continue;
      if (!dmap.has(e.name)) continue;
      var md = jsdocSymbolMarkdown(dmap.get(e.name), pre, m.name);
      build.writeFileText(out, md);
    }
  });
}


// Generate wiki for all exported symbols.
function generateWiki() {
  createWikiFiles();
  generateWikiFiles();
}


// Update index table for README, wiki.
function updateMarkdownIndex(rkind) {
  forEachSourceFile((f, exps, dmap) => {
    var nam = f.replace(/\..*/, '');
    var pre = f === 'index.ts'? '' : nam;
    var out = pre? `wiki/${nam}.md` : 'README.md';
    if (!fs.existsSync(out)) return;
    var txt = build.readFileText(out);
    txt = markdown.replaceTables(txt, (full, rows) => {
      if (rows.length < 1 || rows[0].length < 2) return full;
      rows = rows.map(r => [r[0].trim(), r[1].trim()]);
      if (!/property/i.test(rows[0][0]))    return full;
      if (!/description/i.test(rows[0][1])) return full;
      var rmap = new Map(rows.map((r, i) => [r[0], i]));
      for (var e of exps) {
        if (!dmap.has(e.name)) continue;
        if (!rkind.test(e.kind)) continue;
        var key  = `[${e.name}]`;
        var val = jsdoc.parse(dmap.get(e.name).jsdoc).description.replace(/\n+/g, ' ').trim();
        if (!rmap.has(key)) rows.push([key, val]);
        else rows[rmap.get(key)][1] = val;
      }
      var top = '| ' + rows[0].join(' | ') + ' |\n';
      var mid = '| ' + rows[0].map(r => ` ---- `).join(' | ') + ' |\n';
      var bot = rows.slice(1).map(r => '| ' + r.join(' | ') + ' |\n').join('');
      return top + mid + bot;
    });
    build.writeFileText(out, txt);
  });
}


// Get docs link reference for jsdoc symbol.
function docsLinkReference(sym, pre, repo) {
  var d    = jsdoc.parse(sym.jsdoc);
  var root = `https://${owner}.github.io/${repo}`;
  var name = sym.name;
  var pred = pre? `${pre}.` : '';
  var prem = pre? `modules/${pre}.html` : 'modules.html';
  switch (d.kind) {
    case 'interface': return `[${name}]: ${root}/interfaces/${pred}${name}.html`;
    case 'class':     return `[${name}]: ${root}/classes/${pred}${name}.html`;
    default:          return `[${name}]: ${root}/${prem}#${name}`;
  }
}


// Update link references for README, wiki.
function updateMarkdownLinkReferences() {
  var m = build.readMetadata('.');
  forEachSourceFile((f, exps, dmap) => {
    var nam = f.replace(/\..*/, '');
    var pre = f === 'index.ts'? '' : nam;
    var out = pre? `wiki/${nam}.md` : 'README.md';
    if (!fs.existsSync(out)) return;
    var txt = build.readFileText(out);
    txt = markdown.replaceLinkReferences(txt, (full, name) => {
      if (!dmap.has(name)) return full;
      return docsLinkReference(dmap.get(name), pre, m.name);
    });
    var lset = new Set(markdown.links(txt).filter(x => !x.url).map(x => x.ref || x.name));
    var rset = new Set(markdown.linkReferences(txt).map(x => x.name));
    for (var l of lset) {
      if (rset.has(l)) continue;
      if (!dmap.has(l)) continue;
      txt += docsLinkReference(dmap.get(l), pre, m.name) + '\n';
    }
    build.writeFileText(out, txt);
  });
}


// Update markdowns README, wiki.
function updateMarkdown() {
  updateMarkdownIndex(/const|class|(async\s+)?function\*?/);
  updateMarkdownLinkReferences();
}


function main(a) {
  if (a[2] === 'deploy') deployAll();
  else if (a[2] === 'wiki') generateWiki();
  else if (a[2] === 'markdown') updateMarkdown();
  else generateMain(srcts, '');
}
main(process.argv);
