function initExample(o) {
  var cwd = o.exampleDir;
  var m = jsonRead(o.metadata);
  var pkgs = Object.keys(m.devDependencies||{});
  pkgs = pkgs.filter(p => p !== 'extra-build');
  pkgs.push(o.nameRoot);
  cpExec('npm init -y', {cwd, stdio: null});
  cpExec('npm install '+pkgs.join(' '), {cwd});
}
module.exports = initExample;
