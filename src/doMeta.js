const cpExecStr = require('./cpExecStr');
const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./metaKeywords');
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
  m.description = o.description||mdHeading(r);
  m.version = o.version||getVersion(m.version, o);
  var ks1 = dirKeywords(o.keywordsDir);
  var ks0 = jsonKeywords(m, ks1);
  m.keywords = o.keywords||ks0.concat(ks1);
  o.keywords = m.keywords;
  jsonWrite(pth, m);
}


function getVersion(v, o) {
  var u = cpExecStr(`npm view ${o.name} version`);
  if (semver.diff(u, v) !== 'patch') return v;
  else if (semver.lt(u, v)) return v;
  return semver.inc(v, 'patch');
}
module.exports = doMeta;
