const jsonRead = require('./jsonRead');
const cpExec = require('./cpExec');


function initAsciinema(o) {
  var cwd = o.asciinemaDir;
  var m = jsonRead(o.meta);
  var pkgs = Object.keys(m.devDependencies||{});
  pkgs = pkgs.filter(p => p !== 'extra-build');
  pkgs.push(o.nameRoot);
  cpExec('npm init -y', {cwd, stdio: null});
  cpExec('npm install '+pkgs.join(' '), {cwd});
}
module.exports = initAsciinema;
