const kebabCase = require('./kebabCase');


function packageName(x, o) {
  var x = kebabCase(x.replace(/\$/g, 'Update')), o = o||{};
  if(!o.packageRoot) return x;
  if(!o.packageRoot.startsWith('@')) return `@${o.packageRoot}/${x}`;
  return `${o.packageRoot}.${x}`;
}
module.exports = packageName;
