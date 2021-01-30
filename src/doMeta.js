const console = require('./console');
const cpExecStr = require('./cpExecStr');
const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const metaKeywords = require('./metaKeywords');
const mdHeading = require('./mdHeading');
const dirKeywords = require('./dirKeywords');
const semver = require('semver');


/**
 * Update description, keywords in package.json.
 * @param {string} pth path of package.json
 * @param {object} o options {readmePath, keywordsDir, srcDir}
 */
function doMeta(pth, o) {
  var o = o||{};
  var pth = pth||'package.json';
  console.log(`Updating package.json ...`);
  var m = jsonRead(pth);
  var r = fileRead(o.readme);
  if (o.metaDescription) m.description = o.description||mdHeading(r);
  if (o.metaVersion) m.version = o.version||getVersion(m.version, o);
  var ks1 = dirKeywords(o.keywordsDir);
  var ks0 = metaKeywords(m, ks1);
  if (o.metaKeywords) m.keywords = o.keywords||ks0.concat(ks1);
  o.keywords = m.keywords;
  console.info(`Name: ${m.name}`);
  console.info(`Version: ${m.version}`);
  console.info(`Description: ${m.description}`);
  console.info(`Keywords: ${m.keywords}`);
  jsonWrite(pth, m);
}


function getVersion(v, o) {
  var u = cpExecStr(`npm view ${o.name} version`)||v;
  var d = semver.diff(u, v);
  if (d === 'major' || d === 'minor') return v;
  if (semver.lt(u, v)) return v;
  return semver.inc(v, 'patch');
}
module.exports = doMeta;
