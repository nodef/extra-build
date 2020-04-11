const packageName = require('./packageName');

const RUN = ':running:';
const PKG = ':package:';
const MIN = ':moon:';


function mdSetEmoji(md, o) {
  var p = packageName(o.symbol, o);
  var run = `[${RUN}]: https://npm.runkit.com/${p}`;
  var pkg = `[${PKG}]: https://www.npmjs.com/package/${p}`;
  var min = `[${MIN}]: https://www.npmjs.com/package/${p}.min`;
  md = md.replace(/^([^\.\n]*\.?).*?\n/, `$1 [${RUN}] [${PKG}] [${MIN}]\n`);
  if(!md.includes(run)) md += run+'\n';
  if(!md.includes(pkg)) md += pkg+'\n';
  if(!md.includes(min)) md += min+'\n';
  return md;
}
module.exports = mdSetEmoji;
