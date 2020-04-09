const snakeCase = require('./snakeCase');


function packageName(x, o) {
  var x = snakeCase(x), o = o||{};
  if(!o.package_root) return x;
  if(!o.package_root.startsWith('@')) return `@${o.package_root}/${x}`;
  return `${o.package_root}.${x}`;
}
module.exports = packageName;
