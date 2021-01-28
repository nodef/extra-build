#!/usr/bin/env node
const build = require('./');
const optionRead = require('./src/optionRead');
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
  var cmds = o.command.split(/\W/);
  build(cmds, o);
}
if(require.main===module) main(process.argv);
