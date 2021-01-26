/**
 * Keep only custom exports.
 * @param {string} d javascript data
 */
function exportCustom(d) {
  var rdef = /export \{default as \S+\} from \'\..*?\r?\n/g;
  return d.replace(rdef, '');
}
module.exports = exportCustom;
