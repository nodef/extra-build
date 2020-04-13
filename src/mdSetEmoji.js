const packageName = require('./packageName');
const mdAsciinema = require('./mdAsciinema');

const RUN = ':running:';
const CIN = ':vhs:';
const PKG = ':package:';
const MIN = ':moon:';


function mdSetEmoji(md, o) {
  var p = o.package;
  var rcin = /\[:cin:\]\: (.*)\n/, m = rcin.exec(md);
  if(o.diff_code_blocks) md = md.replace(rcin, '');
  var run = `[${RUN}]: https://npm.runkit.com/${p}`;
  var cin = `[${CIN}]: ${m && !o.diff_code_blocks? m[1] : mdAsciinema(md, o)}`;
  var pkg = `[${PKG}]: https://www.npmjs.com/package/${p}`;
  var min = `[${MIN}]: https://www.npmjs.com/package/${p}.min`;
  md = md.replace(/^([^\.\n]*\.?).*?\n/, `$1 [${RUN}] [${CIN}] [${PKG}] [${MIN}]\n`);
  if(!md.includes(run)) md += run+'\n';
  if(!md.includes(cin)) md += cin+'\n';
  if(!md.includes(pkg)) md += pkg+'\n';
  if(!md.includes(min)) md += min+'\n';
  return md;
}
module.exports = mdSetEmoji;
