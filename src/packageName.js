const kebabCase = require('./kebabCase');


function packageName(x, o) {
  var x = kebabCase(x.replace(/\$/g, 'Update')), o = o||{};
  if(!o.name) return x;
  if(!o.name.startsWith('@')) return `@${o.name}/${x}`;
  return `${o.name}.${x}`;
}
module.exports = packageName;
