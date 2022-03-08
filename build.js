const {fs, package} = require('./');




function main() {
  var modules  = fs.readdirSync('src').filter(f => f !== 'index.js');
  var keywords = modules.map(f => f.replace(/\..*/, ''));
  fs.restoreFileSync('package.json', () => {
    var m = package.read('.');
    m.version  = package.nextUnpublishedVersion(m.name, m.version);
    m.keywords = keywords;
    package.write('.', m);
    package.publish('.');
    package.publishGithub('.', 'nodef');
  });
}
main();
