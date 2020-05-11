const mdAsciinema = require('./mdAsciinema');

const RUN = ':running:';
const CIN = ':vhs:';
const PKG = ':package:';
const MIN = ':moon:';
const LST = ':ledger:';


function mdSetEmoji(md, o) {
  var p = o.package||o.package_root;
  var rcin = /\[:vhs:\]\:\s*([^\n]*)\n/, m = rcin.exec(md);
  if(o.diff_code_blocks) md = md.replace(rcin, '');
  var run = `[${RUN}]: https://npm.runkit.com/${p}`;
  var cin = `[${CIN}]: ${m && !o.diff_code_blocks? m[1] : mdAsciinema(md, o)}`;
  var pkg = `[${PKG}]: https://www.npmjs.com/package/${p}`;
  var min = `[${MIN}]: https://www.npmjs.com/package/${p}.min`;
  var lst = `[${LST}]: https://unpkg.com/${p}/`;
  md = md.replace(/^([^\.\n]*\.?).*?\n/, `$1 [${RUN}] [${CIN}] [${PKG}] [${MIN}] [${LST}]\n`);
  if(!md.includes(run)) md += run+'\n';
  if(!md.includes(cin)) md += cin+'\n';
  if(!md.includes(pkg)) md += pkg+'\n';
  if(!md.includes(min)) md += min+'\n';
  if(!md.includes(lst)) md += lst+'\n';
  return md;
}
module.exports = mdSetEmoji;
