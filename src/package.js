const path   = require('path');
const semver = require('semver');
const cp     = require('./child_process');
const fs     = require('./fs');




/**
 * Read package.json data.
 * @param {string} dir package directory
 * @returns {object} package.json data
 */
function read(dir='.') {
  var pth = path.join(dir, 'package.json');
  return fs.readJsonSync(pth);
}


/**
 * Write package.json data.
 * @param {string} dir package directory
 * @param {object} val package.json data
 */
function write(dir, val) {
  var pth = path.join(dir, 'package.json');
  fs.writeJsonSync(pth, val);
}


/**
 * Get current registry.
 * @param {string} dir package directory
 * @returns {string} current registry
 */
function registry(dir='.') {
  var cwd = dir;
  return cp.execStrSync(`npm config get registry`, {cwd});
}


/**
 * Set current registry.
 * @param {string} dir package directory
 * @param {string} url registry url
 */
function setRegistry(dir, url) {
  var pth = path.join(dir, '.npmrc');
  var txt = fs.existsSync(pth)? fs.readFileTextSync(pth) : '';
  var has = /^registry\s*=/.test(txt);
  if (has) txt = txt.replace(/^registry\s*=.*$/gm, `registry=${url}`);
  else     txt = txt + `\nregistry=${url}`;
  fs.writeFileTextSync(pth, txt.trim() + '\n');
}


/**
 * Get latest package version.
 * @param {string} name package name
 * @returns {string} latest package version
 */
function latestVersion(name) {
  return cp.execStrSync(`npm view ${name} version`);
}


/**
 * Get next unpublished version for package.
 * @param {string} name package name
 * @param {string} ver package version
 * @returns {string} next unpublished version
 */
function nextUnpublishedVersion(name, ver) {
  var u = latestVersion(name);
  var d = semver.diff(u, ver);
  if (d === 'major' || d === 'minor') return ver;
  if (semver.lt(u, ver)) return ver;
  return semver.inc(u, 'patch');
}


/**
 * Publish package to NPM.
 * @param {string} dir package directory
 */
function publish(dir='.') {
  var cwd = dir;
  cp.execLogSync(`npm publish`, {cwd});
}


/**
 * Publish package to GitHub.
 * @param {string} dir package directory
 * @param {string} owner owner name
 */
 function publishGithub(dir, owner) {
  fs.restoreFileSync(path.join(dir, 'package.json'), () => {
    var m   = read(dir);
    var pkg = m.name.replace('@', '').replace('/', '--');
    m.name  = `@${owner}/${pkg}`;
    write(dir, m);
    fs.restoreFileSync(path.join(dir, '.npmrc'), () => {
      setRegistry(dir, `https://npm.pkg.github.com/${owner}`);
      publish(dir);
    });
  });
}
module.exports = {
  read, write,
  registry, setRegistry,
  latestVersion, nextUnpublishedVersion,
  publish, publishGithub,
};
