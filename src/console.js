const kleur = require('kleur');
const util = require('util');


function error(m) {
  console.error(kleur.red(fixup(m)));
}

function warn(m) {
  console.warn(kleur.yellow(fixup(m)));
}

function log(m) {
  console.log(kleur.cyan(fixup(m)));
}

function info(m) {
  console.log(kleur.grey(fixup(m)));
}

function fixup(m) {
  m = m||'';
  m = typeof m !== 'string'? util.inspect(m) : m;
  return m.replace(/^\w+:/, m => kleur.bold(m));
}
module.exports = {error, warn, log, info};
