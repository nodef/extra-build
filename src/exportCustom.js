/**
 * Keep only custom exports.
 * @param {string} d javascript data
 */
function exportCustom(d) {
  var rdef = /^.*\/\/.*\bAUTO-EXPORT\b.*$/gm;
  return d.replace(rdef, '');
}
module.exports = exportCustom;
