#!/usr/bin/env node
const {optionRead, doJsdoc} = require('./src');
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
  switch (o.command) {
    case 'jsdoc': return doJsdoc(null, o);
    default: return;
  }
}
if(require.main===module) main(process.argv);
