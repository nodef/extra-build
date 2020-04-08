'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var globalDirs = _interopDefault(require('global-dirs'));
var child_process = _interopDefault(require('child_process'));
var os = _interopDefault(require('os'));
var tempy = _interopDefault(require('tempy'));
var findNpmPrefix = _interopDefault(require('find-npm-prefix'));
var recast = _interopDefault(require('recast'));

function fsReadDirSync(pth) {
  return fs.existsSync(pth)? fs.readdirSync(pth):[];
}
var fsReadDirSync_1 = fsReadDirSync;

function pathSplit(x) {
  var d = path.dirname(x);
  var e = path.extname(x);
  var f = x.substring(d.length, x.length-e.length).replace(/^\//, '');
  return [d, f, e];
}
var pathSplit_1 = pathSplit;

// Get path to root package.
function packageRoot(pth) {
  while(!fs.existsSync(path.join(pth, 'package.json')))
    pth = path.dirname(pth);
  return pth;
}
var packageRoot_1 = packageRoot;

// Get filename.
function requireResolve(pth) {
  var ext = path.extname(pth);
  return ['.js', '.ts', '.json'].includes(ext)? pth:pth+'.js';
}
var requireResolve_1 = requireResolve;

// Gets requires from code.
function packageRequires(pth, a=[]) {
  var d = fs.readFileSync(requireResolve_1(pth), 'utf8');
  var re = re = /require\(\'(.*?)\'\)/g;
  for(var m=null, reqs=[]; (m=re.exec(d))!=null;)
  { reqs.push(m[1]); a.push(m[1]); }
  if(reqs.length===0) return a;
  var dir = path.dirname(pth);
  for(var p of reqs)
    if(/^\./.test(p)) packageRequires(path.join(dir, p), a);
  return a;
}
var packageRequires_1 = packageRequires;

function snakeCase(x, sep='-') {
  x = x.replace(/([a-z0-9])([A-Z])/g, '$1'+sep+'$2');
  x = x.replace(/[^A-Za-z0-9\.]+/g, sep);
  x = x.replace(/^[^A-Za-z0-9\.]+/, '');
  x = x.replace(/[^A-Za-z0-9\.]+$/, '');
  return x.toLowerCase();
}
var snakeCase_1 = snakeCase;

const BIN = globalDirs.npm.binaries+'/';


// Download page from wiki.
function wikiDownload(pth, o) {
  console.log('wikiDownload:', pth, o);
  var wiki = 'https://raw.githubusercontent.com/wiki/';
  var url = `${wiki}${o.org}/${o.package_root}/${o.readme}.md`;
  child_process.execSync(BIN+`download ${url} > ${pth}`, {stdio});
}
var wikiDownload_1 = wikiDownload;

function mdHeading(pth) {
  console.log('mdHeading:', pth);
  var d = fs.readFileSync(pth, 'utf8');
  return d.replace(/\r?\n[\s\S]*/, '').replace(/[\_\*\[\]]/g, '');
}
var mdHeading_1 = mdHeading;

const {EOL} = os;


// Update README.md based on scatter options.
function mdScatter(pth, o) {
  console.log('mdScatter:', pth, o);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.note_top||/\s+```/, '<br>'+EOL+
    `> This is part of package [${o.package_root}].`+EOL+EOL+
    `[${o.package_root}]: https://www.npmjs.com/package/${o.package_root}`+EOL+EOL+
    (o.note_topvalue||'```')
  );
  fs.writeFileSync(pth, d);
}
var mdScatter_1 = mdScatter;

// Update index.js to use README.md
function jsScatter(pth, o) {
  console.log('jsScatter:', pth, o);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(new RegExp(`less (.*?)${o.readme}.md`, 'g'), `less $1README.md`);
  fs.writeFileSync(pth, d);
}
var jsScatter_1 = jsScatter;

// Update package.json based on scatter options.
function jsonScatter(pth, o) {
  console.log('jsonScatter:', pth, o);
  var d = JSON.parse(fs.readFileSync(pth, 'utf8'));
  d.name = `@${o.package_root}/${o.package}`;
  d.description = o.description;
  d.main = o.main||'index.js';
  d.scripts = {test: 'exit'};
  d.keywords.push(...o.package.split(/\W/));
  d.keywords = Array.from(new Set(d.keywords));
  d.dependencies = Object.assign({}, o.dependencies, o.devDependencies);
  var dep_pkgs = Object.keys(d.dependencies)||[];
  for(var p of dep_pkgs)
    if(!o.requires.includes(p)) d.dependencies[p] = undefined;
  d.devDependencies = undefined;
  fs.writeFileSync(pth, JSON.stringify(d, null, 2));
}
var jsonScatter_1 = jsonScatter;

// Scatter a file as a package.
function packageScatter(pth, o) {
  console.log('packageScatter:', pth, o);
  var o = Object.assign({}, o);
  var tmp = tempy.directory();
  var [dir, fil, ext] = pathSplit_1(pth);
  var src = packageRoot_1(pth);
  var nam = fil.replace(/\$/g, 'Update');
  var json_src = path.join(src, 'package.json');
  var readme = path.join(tmp, 'README.md');
  var index = path.join(tmp, 'index'+ext);
  var json = path.join(tmp, 'package.json');
  o.package = o.package||snakeCase_1(nam);
  o.readme = o.readme||fil.replace(/[?]+$/, '');
  wikiDownload_1(readme, o);
  o.description = o.description||mdHeading_1(readme);
  mdScatter_1(readme, o);
  fs.copyFileSync(pth, index);
  jsScatter_1(index, o);
  o.requires = packageRequires_1(pth);
  fs.copyFileSync(json_src, json);
  jsonScatter_1(json, o);
  for(var r of o.requires) {
    if(!(/^[\.\/]/).test(r)) continue;
    r = requireResolve_1(r);
    var src = path.join(dir, r);
    var dst = path.join(tmp, r);
    fs.copyFileSync(src, dst);
  }
  return tmp;
}
var packageScatter_1 = packageScatter;

// Adds minified message to package.json in place.
function jsonMinify(pth, o) {
  console.log('jsonMinify: ', pth, o);
  var d = JSON.parse(fs.readFileSync(pth, 'utf8'));
  d.name += '.min';
  d.description = d.description.replace('.$', ' (browserified, minifined).');
  d.scripts = {test: 'exit'};
  d.devDependencies = undefined;
  fs.writeFileSync(pth, JSON.stringify(d, null, 2));
  return d.name.replace(/\.min$/, '');
}
var jsonMinify_1 = jsonMinify;

const {EOL: EOL$1} = os;


// Adds minified message to README.md in place.
function mdMinify(pth, o) {
  console.log('mdMinify: ', pth, o);
  var d = fs.readFileSync(pth, 'utf8');
  d = d.replace(o.note_minified||/^> .*?minified.*$/m, '');
  d = d.replace(o.note_top||/\s+```/, '<br>'+EOL$1+
    `> This is browserified, minified version of [${o.package}].<br>`+EOL$1+
    `> It is exported as global variable **${o.standalone}**.<br>`+EOL$1+
    `> CDN: [unpkg], [jsDelivr].`+EOL$1+EOL$1+
    `[${o.package}]: https://www.npmjs.com/package/${o.package}`+EOL$1+
    `[unpkg]: https://unpkg.com/${o.package}.min`+EOL$1+
    `[jsDelivr]: https://cdn.jsdelivr.net/npm/${o.package}.min`+EOL$1+EOL$1+
    (o.note_topvalue||'```')
  );
  fs.writeFileSync(pth, d);
}
var mdMinify_1 = mdMinify;

const BIN$1 = globalDirs.npm.binaries+'/';
const stdio$1 = [0, 1, 2];


// Minifies JS file in place.
function jsMinify(pth, o) {
  console.log('jsMinify: ', pth, o);
  var s = fs.statSync(pth);
  child_process.execSync(BIN$1+`browserify ${pth} -s ${o.standalone} -o ${pth}.tmp`, {stdio: stdio$1});
  if(s.size<4*1024*1024) child_process.execSync(BIN$1+`uglifyjs -c -m -o ${pth} ${pth}.tmp`, {stdio: stdio$1});
  else child_process.execSync(`mv ${pth}.tmp ${pth}`, {stdio: stdio$1});
  child_process.execSync(`rm -f ${pth}.tmp`, {stdio: stdio$1});
}
var jsMinify_1 = jsMinify;

// Minifies package in place.
function packageMinify(pth, o) {
  console.log('packageMinify: ', pth, o);
  var o = Object.assign({}, o);
  o.package = jsonMinify_1(path.join(pth, 'package.json'), o);
  mdMinify_1(path.join(pth, 'README.md'), o);
  jsMinify_1(path.join(pth, 'index.js'), o);
}
var packageMinify_1 = packageMinify;

const ORG = 'nodef';
const PACKAGE_ROOT = JSON.parse(fs.readFileSync('package.json', 'utf8')).name;
const STANDALONE_ROOT = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');
const OPTIONS = {
  org: ORG,
  package_root: PACKAGE_ROOT,
  standalone_root: STANDALONE_ROOT
};
const stdio$2 = [0, 1, 2];


function dirScatter(pth, o) {
  console.log('dirScatter:', pth, o);
  var o = Object.assign({}, OPTIONS, o);
  for(var f of fsReadDirSync_1(pth)) {
    if(path.extname(f)!=='.js') continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    try {
    var pth = path.join(pth, f);
    var tmp = packageScatter_1(pth, o);
    child_process.execSync('npm publish', {cwd: tmp, stdio: stdio$2});
    var standalone = snakeCase_1(f.replace(/\..*/, ''), '_');
    standalone = o.standalone_root+'_'+standalone;
    packageMinify_1(tmp, Object.assign({standalone}, o));
    child_process.execSync('npm publish', {cwd: tmp, stdio: stdio$2});
    child_process.execSync(`rm -rf ${tmp}`);
    }
    catch(e) { console.error(e); }
  }
  standalone = o.standalone_root;
  packageMinify_1('.', Object.assign({standalone}, o));
  child_process.execSync('npm publish', {stdio: stdio$2});
}
var dirScatter_1 = dirScatter;

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var jsBundle_1 = createCommonjsModule(function (module) {
// # browserify
// # uglify
// 1. process .js -> single .js
// 2. process .js + package.json -> package.json
// 3. process .js + README.md -> README.md
// 4. create package and publish






// Global variables.
var OPTIONS = {
  dependencies: false,
  devDependencies: false,
  allDependencies: false
};


// Get last value in array.
function last(arr, i=1) {
  return arr[arr.length-i];
}
// Remove value from array.
function remove(arr, val) {
  var i = arr.indexOf(val);
  if(i>=0) arr.splice(i, 1);
  return arr;
}
// Get key of value in object.
function keyOf(obj, val) {
  for(var k in obj)
    if(obj[k]===val) return k;
  return null;
}
// Add all values to set.
function addAll(set, vals) {
  for(var v of vals)
    set.add(v);
  return set;
}
// Read json file at path.
function jsonRead(pth) {
  if(!fs.existsSync(pth)) return null;
  return JSON.parse(fs.readFileSync(pth, 'utf8'));
}
// Check if node is function.
function nodeIsFunction(ast) {
  return /Function(Declaration|Expression)/.test(ast.type);
}
// Check if node is assignment.
function nodeIsAssignment(ast) {
  if(ast.type==='VariableDeclarator') return true;
  return ast.type==='AssignmentExpression';
}
// Check if node is require().
function nodeIsRequire(ast) {
  if(ast.type!=='CallExpression') return false;
  var {name} = ast.callee, {value} = ast.arguments[0]||{};
  return name==='require' && value.startsWith('.');
}
// Check if node is exports.
function nodeIsExports(ast) {
  if(ast.type!=='ExpressionStatement') return false;
  if(ast.expression.left.type!=='MemberExpression') return false;
  return ast.expression.left.object.name==='exports';
}
// Check if node is module.exports.
function nodeIsModuleExports(ast) {
  if(ast.type!=='ExpressionStatement') return false;
  if(ast.expression.left.type!=='MemberExpression') return false;
  if(ast.expression.left.object.name!=='module') return false;
  return ast.expression.left.property.name==='exports';
}
// Get assignment name.
function assignmentName(ast) {
  if(ast.type==='VariableDeclarator') return ast.id.name;
  else if(ast.type==='AssignmentExpression') return ast.left.name;
  return null;
}
// Remove an assignment from hierarchy.
function assignmentRemove(asth) {
  var ast1 = last(asth), ast2 = last(asth, 2), ast3 = last(asth, 3);
  if(ast1.type==='AssignmentExpression') remove(ast3, ast2);
  else if(ast1.type==='VariableDeclarator') {
    if(ast2.length>1) remove(ast2, ast1);
    else remove(last(asth, 4), ast3);
  }
  return asth;
}
// Get function parameter name.
function paramName(ast) {
  if(ast.type==='Identifier') return ast.name;
  else if(ast.type==='RestElement') return ast.argument.name;
  else if(ast.type==='AssignmentPattern') return ast.left.name;
  return null;
}
// Get function parameter names.
function functionParams(ast, set=new Set()) {
  for(var p of ast.params)
    set.add(paramName(p));
  return set;
}
// Get variable declaration names.
function variableDeclarationNames(ast, set=new Set()) {
  for(var d of ast.declarations)
    set.add(d.id.name);
  return set;
}
// Get declaration names.
function declarationNames(ast, set=new Set()) {
  if(ast.type==='FunctionDeclaration') set.add(ast.id.name);
  else if(ast.type==='VariableDeclaration') variableDeclarationNames(ast, set);
  return set;
}
// Get global identifier names.
function bodyGlobals(ast, set=new Set()) {
  for(var s of ast)
    declarationNames(s, set);
  return set;
}
// Get empty window identifier map.
function bodyEmptyWindow(ast, win=new Map()) {
  for(var nam of bodyGlobals(ast))
    win.set(nam, []);
  return win;
}
// Get (scanned) window identifier map.
function bodyWindow(ast, win=bodyEmptyWindow(ast), exc=new Set()) {
  if(ast==null || typeof ast!=='object') return win;
  if(nodeIsFunction(ast)) {
    bodyWindow(ast.id, win, exc);
    var excn = functionParams(ast, new Set(exc));
    return bodyWindow(ast.body, win, excn);
  }
  if(ast.type==='Identifier') {
    if(!win.has(ast.name) || exc.has(ast.name)) return win;
    win.get(ast.name).push(ast); return win;
  }
  for(var k in ast)
    bodyWindow(ast[k], win, exc);
  return win;
}
// Get actual name of window identifier.
function windowName(win, nam) {
  if(!win.has(nam)) return nam;
  return win.get(nam)[0].name;
}
// Rename a window identifier.
function windowRename(win, nam, to) {
  for(var ast of win.get(nam))
    ast.name = to;
  return win;
}
// Add window identifier to globals.
function globalsAdd(glo, win, nam, suf) {
  if(!glo.has(nam)) return glo.add(nam);
  if(!glo.has(nam+suf)) {
    windowRename(win, nam, nam+suf);
    return glo.add(nam+suf);
  }
  for(var i=0; glo.has(nam+suf+i); i++) {}
  windowRename(win, nam, nam+suf+i);
  return glo.add(nam+suf+i);
}
// Add all window identifiers to globals.
function globalsAddAll(glo, win, suf) {
  for(var nam of win.keys())
    globalsAdd(glo, win, nam, suf);
  return glo;
}
// Update exports to given name.
function bodyUpdateExports(ast, nam) {
  for(var i=ast.length-1, idx=-1; i>=0; i--) {
    if(!nodeIsExports(ast[i])) continue;
    ast[idx=i].expression.left.object.name = nam;
  }
  if(idx<0) return null;
  var astn = recast.parse(`\nconst ${nam} = {};`);
  ast.splice(idx, 0, astn.program.body[0]);
  return nam;
}
// Update module.exports to given name, if possible.
function bodyUpdateModuleExports(ast, nam) {
  for(var i=ast.length-1, idx=-1, rgt=null; i>=0; i--) {
    if(!nodeIsModuleExports(ast[i])) continue;
    rgt = ast[idx=i].expression.right;
    ast.splice(i, 1);
  }
  if(idx<0) return null;
  if(rgt.type==='Identifier') return rgt.name;
  var astn = recast.parse(`\nconst ${nam} = 0;`);
  astn.program.body[0].declarations[0].init = rgt;
  ast.splice(idx, 0, astn.program.body[0]);
  return nam;
}
// Update require() using module load function.
// : support __dirname, __filename?
function bodyUpdateRequire(ast, astp, fn) {
  if(ast==null || typeof ast!=='object') return ast;
  if(!nodeIsRequire(ast)) {
    astp.push(ast);
    for(var astv of Object.values(ast))
      bodyUpdateRequire(astv, astp, fn);
    return astp.pop();
  }
  var nam = fn(ast.arguments[0].value), ast1 = last(astp);
  if(nam==null) return ast;
  if(nodeIsAssignment(ast1) && assignmentName(ast1)===nam) {
    assignmentRemove(astp); return ast;
  }
  var astr = recast.parse(`const a = ${nam};`);
  ast1[keyOf(ast1, ast)] = astr.program.body[0].declarations[0].init;
  return ast;
}
// Bundle script with options
function bundleScript(pth, sym, exc=new Set(), top=false) {
  var code = fs.readFileSync(pth, 'utf8'), paths = [path.dirname(pth)];
  var ast = recast.parse(code), body = ast.program.body;
  bodyUpdateRequire(body, [], val => {
    if(exc.has(val)) return null;
    var pth = commonjsRequire.resolve(val, {paths});
    if(sym.exports.has(pth)) return sym.exports.get(pth).name;
    return bundleScript(pth, sym, exc);
  });
  var suf = !top? sym.exports.size.toString():'', nam = 'exports'+suf;
  if(!top) nam = bodyUpdateExports(body, nam)||bodyUpdateModuleExports(body, nam);
  var win = bodyWindow(body); globalsAddAll(sym.globals, win, suf);
  sym.exports.set(pth, {name: nam, suffix: suf, code: recast.print(ast).code});
  return windowName(win, nam);
}
// Get exclude set for bundle.
function bundleExclude(pth, opt) {
  var exc = new Set();
  var pkg = jsonRead(path.join(pth, 'package.json'))||{};
  var pkgl = jsonRead(path.join(pth, 'package-lock.json'))||{};
  if(opt.dependencies && pkg.dependencies) addAll(exc, Object.keys(pkg.dependencies));
  if(opt.devDependencies && pkg.devDependencies) addAll(exc, Object.keys(pkg.devDependencies));
  if(opt.allDependencies && pkgl.dependencies) addAll(exc, Object.keys(pkgl.dependencies));
  return exc;
}
async function jsBundle(pth, o) {
  var o = Object.assign({}, OPTIONS, o), z = '';
  var cwd = process.cwd();
  var pth = path.join(cwd, pth);
  var pfx = await findNpmPrefix(cwd);
  var sym = {exports: new Map(), globals: new Set()};
  var exc = bundleExclude(pfx, o);
  bundleScript(pth, sym, exc, true);
  for(var exp of sym.exports.values())
    z += exp.code;
  return z;
}module.exports =  jsBundle;

// Bundle main file.
async function main(a) {
  var data = await jsBundle('src/index.js', {dependencies: true});
  fs.writeFileSync('index.js', data);
}if(commonjsRequire.main===module) main(process.argv);
});

// Reads JSDoc in js file.
function jsJsdoc(js) {
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
var jsJsdoc_1 = jsJsdoc;

function dirJsdocs(dir) {
  var os = new Map();
  for(var f of fs.readdirSync(dir)) {
    if(!f.endsWith('.js')) continue;
    if(f.startsWith('_')) continue;
    if(f==='index.js') continue;
    var name = f.replace(/[?]*\.js/, '');
    var p = path.join(dir, f);
    var js = fs.readFileSync(p, 'utf8');
    var o = jsJsdoc_1(js);
    if(!o) { console.log('dirJsdocs: no jsdoc for '+p); }
    os.set(name, o);
  }
  return os;
}
var dirJsdocs_1 = dirJsdocs;

// Preserve link brackets.
function mdReplace(x, y) {
  var links = new Set();
  var rref = /(.?)\[([\w\s\-$.]+)\](.?)/g, m = null;
  while((m=rref.exec(x))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  for(var l of links)
    y = y.replace(l, `[${l}]`);
  return y;
}
var mdReplace_1 = mdReplace;

// Sets wiki from JSDoc.
function mdSetJsdoc(md, o) {
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
  md = md.replace(/^.*?\n/, m => mdReplace_1(m, o.description)+'\n');
  md = md.replace(/```javascript[\s\S]*?```\n/, def);
  return md;
}
var mdSetJsdoc_1 = mdSetJsdoc;

function mdSetLinks(md, o) {
  var txt = md.replace(/```.*?```/gs, '');
  var links = new Set();
  var rref = /(.?)\[([\w\-$.]+)\](.?)/g, m = null;
  var rlink = /^\[([\w\-$.]+)\]\s*:\s*(.*?)$/gm, m = null;
  while((m=rref.exec(txt))!=null)
    if(m[1]!=='!' && m[3]!=='(') links.add(m[2]);
  while((m=rlink.exec(txt))!=null)
    links.delete(m[1]);
  for(var l of links) {
    console.log('mdSetLinks: '+l);
    md = md+`[${l}]: https://github.com/${o.org}/${o.package}/wiki/${l}\n`;
  }
  return md;
}
var mdSetLinks_1 = mdSetLinks;

function docsUpdate(dir, os, ot) {
  for(var f of fs.readdirSync(dir)) {
    if(!f.endsWith('.md')) continue;
    if(f.startsWith('_')) continue;
    if(f==='Home.md') continue;
    var name = f.replace('.md', '');
    var p = path.join(dir, f);
    var md = fs.readFileSync(p, 'utf8');
    var o = os.get(name);
    if(!o) { console.log('docsUpdate: no jsdoc for '+p); continue; }
    md = mdSetJsdoc_1(md, Object.assign({}, ot, o));
    md = mdSetLinks_1(md, ot);
    fs.writeFileSync(p, md);
  }
}
var docsUpdate_1 = docsUpdate;

// Sets README table from JSDoc.
function mdSetTable(md, os) {
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
var mdSetTable_1 = mdSetTable;

function readmeUpdate(os, ot) {
  var p = 'README.md';
  var md = fs.readFileSync(p, 'utf8');
  md = mdSetTable_1(md, os);
  md = mdSetLinks_1(md, ot);
  fs.writeFileSync(p, md);
}
var readmeUpdate_1 = readmeUpdate;

function jsonSetKeywords(ks) {
  var d = fs.readFileSync('package.json', 'utf8');
  var p = JSON.parse(d), {keywords} = p;
  for(var k of ks) {
    var i = keywords.indexOf(k);
    if(i>=0) keywords.length = Math.min(keywords.length, i);
  }
  p.keywords = [...keywords, ...ks];
  var d = JSON.stringify(p, null, 2)+'\n';
  fs.writeFileSync('package.json', d);
}
var jsonSetKeywords_1 = jsonSetKeywords;

const ORG$1 = 'nodef';
const PACKAGE = path.basename(process.cwd());
const ROOTNAME = PACKAGE.replace(/.*?-/, '');
const OPTIONS$1 = {
  org: ORG$1,
  package: PACKAGE,
  rootname: ROOTNAME
};


function packageUpdate(pth, o) {
  var ot = Object.assign({}, OPTIONS$1, o);
  var os = dirJsdocs_1(path.join(pth, 'src'));
  docsUpdate_1(path.join(pth, 'docs'), os, ot);
  readmeUpdate_1(os, ot);
  jsonSetKeywords_1(os.keys());
}var packageUpdate_1 = packageUpdate;

var dirScatter$1 = dirScatter_1;
var jsBundle = jsBundle_1;
var packageUpdate$1 = packageUpdate_1;

var src = {
	dirScatter: dirScatter$1,
	jsBundle: jsBundle,
	packageUpdate: packageUpdate$1
};

exports.default = src;
exports.dirScatter = dirScatter$1;
exports.jsBundle = jsBundle;
exports.packageUpdate = packageUpdate$1;
