const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./jsonKeywords');
const mdRead = require('./mdRead');
const mdHeading = require('./mdHeading');
const dirKeywords = require('./dirKeywords');


/**
 * Update description, keywords in package.json.
 * @param {string} pth path of package.json
 * @param {object} opt options {readmePath, keywordsDir, srcDir}
 */
function updateJson(pth, opt) {
  var o = opt||{};
  var pth = pth||'package.json';
  var x = jsonRead(pth);
  var md = mdRead(o.readmePath);
  x.description = mdHeading(md);
  var ks1 = dirKeywords(o.keywordsDir||o.srcDir);
  var ks0 = jsonKeywords(x, ks1);
  x.keywords = ks0.concat(ks1);
  jsonWrite(pth, x);
}
module.exports = updateJson;
