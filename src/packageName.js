const kebabCase = require('./kebabCase');


function packageName(x, o) {
  var x = kebabCase(x.replace(/\$/g, 'Update')), o = o||{};
  if(!o.package_root) return x;
  if(!o.package_root.startsWith('@')) return `@${o.package_root}/${x}`;
  return `${o.package_root}.${x}`;
}
module.exports = packageName;
