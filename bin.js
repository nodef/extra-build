#!/usr/bin/env node
const {optionRead} = require('./src');
const kleur = require('kleur');
const cp = require('child_process');

const E = process.env;
const OPTIONS = {
  command: 'all'
};
const stdio = [0, 1, 2];


function main(a) {
  var o = Object.assign({}, OPTIONS);
  for (var i=2, I=a.length; i<I;)
    i = optionRead(o, a[i], a, i);
  if (o.help) return cp.execSync('less README.md', {cwd: process.cwd(), stdio});
  console.log(o);
  return;
  switch (o.command) {
    case 'init': return build.init(o);
    case 'update': return build.update(o);
    case 'scatter': return build.scatter(o.dir, o);
    default: return;
  }
}
if(require.main===module) main(process.argv);
