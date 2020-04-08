const dirJsdocs = require('./src/dirJsdocs');
const jsonSetKeywords = require('./src/jsonSetKeywords');
const readmeUpdate = require('./src/readmeUpdate');
const docsUpdate = require('./src/docsUpdate');


// Run on shell.
async function main() {
  var org = 'nodef';
  var package = path.basename(__dirname);
  var rootname = package.replace(/.*?-/, '');
  var ot = {org, package, rootname};
  await bundleMain();
  var os = dirJsdocs('src');
  docsUpdate('wiki', os, ot);
  readmeUpdate(os, ot);
  jsonSetKeywords(os.keys());
};
main();
