const dirScatter = require('./src/dirScatter');

const ORG = 'nodef';
const PACKAGE_ROOT = require('./package.json').name;
const STANDALONE_ROOT = PACKAGE_ROOT.replace(/extra-/, '').replace(/\W+/, '_');


// Run on shell.
function main(a) {
  console.log('main:', a);
  var o = {org: ORG, package_root: PACKAGE_ROOT, standalone_root: STANDALONE_ROOT};
  dirScatter('src', o);
}
if(require.main===module) main(process.argv);
