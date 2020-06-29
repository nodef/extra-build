#!/usr/bin/env node
const build = require('./');
const dotProp = require('dot-prop');

const E = process.env;
const OPTIONS = {
  help: false,
  command: 'update'
};
const STDIO = [0, 1, 2];


function main(a) {
  var o = Object.assign({}, OPTIONS);
  for(var i=2, I=a.length; i<I;)
    i = options(o, a[i], a, i);
  if(o.help) return cp.execSync('less README.md', {cwd: process.cwd(), stdio: STDIO});
  if(o.command==='init') return build.init(o);
  if(o.command==='update') return build.update(o);
  if(o.command==='scatter') return build.scatter(o.dir, o);
}

function options(o, k, a, i) {
  if(k==='--help') o.help = true;
  else if(k.startsWith('--')) dotProp.set(o, k.substring(2), parse(a[++i]));
  else o.command = a[i];
  return i+1;
}

function parse(x) {
  try { return JSON.parse(x); }
  catch(e) { return x; }
}
if(require.main===module) main(process.argv);
