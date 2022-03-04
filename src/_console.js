const util  = require('util');
const kleur = require('kleur');




/**
 * Get formatted data for display to console.
 * @param {any} x data
 * @returns {string} formatted data
 */
function fixup(x) {
  x = x||'';
  x = typeof x !== 'string'? util.inspect(x) : x;
  return x.replace(/^\w+:/, m => kleur.bold(m));
}


/**
 * Print error message to stderr with newline.
 * @param {any} x data
 */
function error(x) {
  console.error(kleur.red(fixup(x)));
}


/**
 * Print warning message to stderr with newline.
 * @param {any} x data
 */
function warn(x) {
  console.warn(kleur.yellow(fixup(x)));
}


/**
 * Print log message to stdout with newline.
 * @param {any} x data
 */
function log(x) {
  console.log(kleur.cyan(fixup(x)));
}


/**
 * Print info message to stdout with newline.
 * @param {any} x data
 */
function info(x) {
  console.log(kleur.grey(fixup(x)));
}
module.exports = {error, warn, log, info};
