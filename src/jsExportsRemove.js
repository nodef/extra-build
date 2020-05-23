// Removes (local) exports.
function jsExportsRemove(d) {
  var rjs = /exports\.\S+ = require\(\'\.\/.*?\r?\n/g;
  var res = /export \{default as \S+\} from \'\..*?\r?\n/g;
  return d.replace(rjs, '').replace(res, '');
}
module.exports = jsExportsRemove;
