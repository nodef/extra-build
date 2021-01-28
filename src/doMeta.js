const fileRead = require('./fileRead');
const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./metaKeywords');
const mdHeading = require('./mdHeading');
const dirKeywords = require('./dirKeywords');


/**
 * Update description, keywords in package.json.
 * @param {string} pth path of package.json
 * @param {object} o options {readmePath, keywordsDir, srcDir}
 */
function doMeta(pth, o) {
  var o = o||{};
  var pth = pth||'package.json';
  var m = jsonRead(pth);
  var r = fileRead(o.readme);
  m.description = o.description||mdHeading(r);
  var ks1 = dirKeywords(o.keywordsDir);
  var ks0 = jsonKeywords(m, ks1);
  m.keywords = o.keywords||ks0.concat(ks1);
  jsonWrite(pth, m);
}
module.exports = doMeta;
