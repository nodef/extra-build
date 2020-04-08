const dirJsdocs = require('./dirJsdocs');
const wikiUpdate = require('./wikiUpdate');
const readmeUpdate = require('./readmeUpdate');
const jsonSetKeywords = require('./jsonSetKeywords');
const path = require('path');

const ORG = 'nodef';
const PACKAGE_ROOT = path.basename(process.cwd());
const NAME_ROOT = PACKAGE_ROOT.replace(/.*?-/, '');
const OPTIONS = {
  org: ORG,
  package_root: PACKAGE_ROOT,
  package: PACKAGE_ROOT,
  name_root: NAME_ROOT,
  name: NAME_ROOT
};


function packageUpdate(pth, o) {
  var ot = Object.assign({}, OPTIONS, o);
  var os = dirJsdocs(path.join(pth, 'src'));
  wikiUpdate(path.join(pth, 'wiki'), os, ot);
  readmeUpdate(os, ot);
  jsonSetKeywords(os.keys());
};
module.exports = packageUpdate;
