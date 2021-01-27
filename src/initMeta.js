const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');


/**
 * Initialize package metadata (package.json).
 * @param {string} pth path of package.json
 * @param {object} o options
 */
function initMeta(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log(`Initializing metadata at ${pth} ...`);
  var x = jsonRead(pth);
  x.runkitExampleFilename = x.runkitExampleFilename||'example.js';
  var scripts = x.scripts||{};
  scripts.test = scripts.test||'exit';
  scripts.einit = scripts.einit||'ebuild init';
  scripts.ecode = scripts.ecode||'ebuild update --docs false';
  scripts.eupdate = scripts.eupdate||'ebuild update';
  scripts.escatter = scripts.escatter||'ebuild scatter';
  x.scripts = scripts;
  jsonWrite(pth, x);
}
module.exports = initMeta;
