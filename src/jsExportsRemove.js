// Removes (local) exports.
function jsExportsRemove(d) {
  var rjs = /exports\.\S+ = require\(\'\.\/.*?\n/g;
  var res = /export \{default as \S+\} from \'\..*?\n/g;
  return d.replace(rjs, '').replace(res, '');
}
module.exports = jsExportsRemove;
