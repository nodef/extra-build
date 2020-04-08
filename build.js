
function replaceKeepBrackets(x, y) {
  var links = new Set();
  var rref = /(.?)\[([\w\s\-$.]+)\](.?)/g, m = null;
  while((m=rref.exec(x))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  for(var l of links)
    y = y.replace(l, `[${l}]`);
  return y;
}

// Reads JSDoc in js file.
function getJsdoc(js) {
  var c = js.replace(/.*?(\/\*\*.*?\*\/).*/s, '$1');
  if(c.length===js.length) return null;
  var description = c.match(/\s+\*\s+(.*?)\n/)[1];
  var rparam = /\s+\*\s+@param\s+(?:\{(.*?)\}\s+)(.*?)\s+(.*?)\n/g;
  var params = new Map(), m = null;
  while((m=rparam.exec(c))!=null) {
    params.set(m[2], {type: m[1], description: m[3]});
    if(!m[2].includes('.')) continue;
    var k = m[2].replace(/\..*/, '');
    params.get(k).type += '?';
  }
  var rreturns = /\s+\*\s+@returns\s+(?:\{(.*?)\}\s+)(.*?)\n/;
  m = rreturns.exec(c);
  var returns = m? {type: m[1], description: m[2]}:null;
  var next = js.substring(js.indexOf(c)+c.length);
  var name = next.replace(/.*?function\*?\s+(.*?)\(.*/s, '$1');
  return {description, params, returns, name};
}

// Sets wiki from JSDoc.
function setWiki(md, o) {
  var pre = Math.max(...[...o.params.keys()].map(v => v.length));
  var args = [...o.params].filter(([k]) => k.indexOf('.')<0).map(([k, v]) => v.type.startsWith('...')? `...${k}`:(v.type.endsWith('?')? `[${k}]`:k));
  var pars = [...o.params].map(([k, v]) => `// ${(k.replace(/.*?\./, '.')+':').padEnd(pre+2)}${v.description}`);
  var def =
    '```javascript\n'+
    `${o.rootname}.${o.name}(`+args.join(', ')+`);\n`+
    pars.join('\n')+'\n'+
    (o.returns? `// --> `+o.returns.description+'\n':'')+
    '```\n';
  md = md||'Blank.\n\n```javascript\n```\n';
  md = md.replace(/^.*?\n/, m => replaceKeepBrackets(m, o.description)+'\n');
  md = md.replace(/```javascript[\s\S]*?```\n/, def);
  return md;
}

function setWikiLinks(md, o) {
  var txt = md.replace(/```.*?```/gs, '');
  var links = new Set();
  var rref = /(.?)\[([\w\-$.]+)\](.?)/g, m = null;
  var rlink = /^\[([\w\-$.]+)\]\s*:\s*(.*?)$/gm, m = null;
  while((m=rref.exec(txt))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  while((m=rlink.exec(txt))!=null)
    links.delete(m[1]);
  for(var l of links) {
    console.log('setWikiLinks: '+l);
    md = md+`[${l}]: https://github.com/${o.org}/${o.package}/wiki/${l}\n`;
  }
  return md;
}

// Sets README table from JSDoc.
function setTable(md, os) {
  var i = md.search(/\|\s+Method\s+\|/);
  var top = md.substring(0, i);
  var tab = md.substring(i);
  var I = tab.search(/^[^\|]/m);
  var bot = tab.substring(I);
  var tab = tab.substring(0, I);
  var rrow = /^(\|\s+\[(.*?)\]\s+\|\s+)(.*?)\n/gm, m = null;
  while((m=rrow.exec(tab))!=null) {
    var description = os.get(m[2])? os.get(m[2]).description: m[3];
    tab = tab.replace(m[0], m[1]+description+'\n');
  }
  return top+tab+bot;
}

function getJsdocs(dir) {
  var os = new Map();
  for(var f of fs.readdirSync(dir)) {
    if(!f.endsWith('.js')) continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    var name = f.replace(/[?]*\.js/, '');
    var p = path.join(dir, f);
    var js = fs.readFileSync(p, 'utf8');
    var o = getJsdoc(js);
    if(!o) { console.log('getJsdocs: no jsdoc for '+p); }
    os.set(name, o);
  }
  return os;
}

function setWikis(dir, os, ot) {
  for(var f of fs.readdirSync(dir)) {
    if(!f.endsWith('.md')) continue;
    if(f.startsWith('_')) continue;
    if(f==='Home.md') continue;
    var name = f.replace('.md', '');
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var o = os.get(name);
    if(!o) { console.log('setWikis: no jsdoc for '+p); continue; }
    md = setWiki(md, Object.assign({}, ot, o));
    md = setWikiLinks(md, ot);
    fs.writeFileSync(p, md);
  }
}

function setReadme(os, ot) {
  var p = 'README.md';
  var md = fs.readFileSync(p, 'utf8');
  md = setTable(md, os);
  md = setWikiLinks(md, ot);
  fs.writeFileSync(p, md);
}

function setKeywords(os) {
  var d = fs.readFileSync('package.json', 'utf8');
  var p = JSON.parse(d), {keywords} = p;
  for(var k of os.keys()) {
    var i = keywords.indexOf(k);
    if(i>=0) keywords.length = Math.min(keywords.length, i);
  }
  p.keywords = [...keywords, ...os.keys()];
  var d = JSON.stringify(p, null, 2)+'\n';
  fs.writeFileSync('package.json', d);
}

// Run on shell.
async function main() {
  var org = 'nodef';
  var package = path.basename(__dirname);
  var rootname = package.replace(/.*?-/, '');
  var ot = {org, package, rootname};
  await bundleMain();
  var os = getJsdocs('src');
  setWikis('wiki', os, ot);
  setReadme(os, ot);
  setKeywords(os);
};
main();
