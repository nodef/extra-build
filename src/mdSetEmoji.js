const mdAsciinema = require('./mdAsciinema');
const {EOL} = require('os');

const RUN = ':running:';
const CIN = ':vhs:';
const PKG = ':package:';
const MIN = ':moon:';
const LST = ':ledger:';


function mdSetEmoji(md, o) {
  var p = o.package||o.package_root;
  var rcin = /\[:vhs:\]\:\s*([^\r\n]*)\r?\n/, m = rcin.exec(md);
  if(o.diff_code_blocks) md = md.replace(rcin, '');
  var run = `[${RUN}]: https://npm.runkit.com/${p}`;
  var cin = o.asciinema? `[${CIN}]: ${m && !o.diff_code_blocks? m[1]:mdAsciinema(md, o)}`:'';
  var pkg = `[${PKG}]: https://www.npmjs.com/package/${p}`;
  var min = `[${MIN}]: https://www.npmjs.com/package/${p}.min`;
  var lst = `[${LST}]: https://unpkg.com/${p}/`;
  var lnk = [RUN, ...(o.asciinema? [CIN]:[]), PKG, MIN, LST];
  md = md.replace(/^([^\.\r\n]*\.?).*?\r?\n/, '$1 '+lnk.map(l => `[${l}]`).join(' ')+EOL);
  if(!md.includes(run)) md += run+EOL;
  if(!md.includes(cin) && o.asciinema) md += cin+EOL;
  if(!md.includes(pkg)) md += pkg+EOL;
  if(!md.includes(min)) md += min+EOL;
  if(!md.includes(lst)) md += lst+EOL;
  return md;
}
module.exports = mdSetEmoji;
