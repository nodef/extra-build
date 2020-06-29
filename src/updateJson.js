const jsonRead = require('./jsonRead');
const jsonWrite = require('./jsonWrite');
const jsonKeywords = require('./jsonKeywords');
const mdRead = require('./mdRead');
const mdHeading = require('./mdHeading');
const dirKeywords = require('./dirKeywords');
const kleur = require('kleur');


function updateJson(pth, o) {
  var pth = pth||'package.json', o = o||{};
  console.log(kleur.cyan('updateJson:'), pth);
  var x = jsonRead(pth);
  var md = mdRead(o.readme_path);
  x.description = mdHeading(md);
  var ks1 = dirKeywords(o.keywords_dir);
  var ks0 = jsonKeywords(x, ks1);
  x.keywords = ks0.concat(ks1);
  jsonWrite(pth, x);
}
module.exports = updateJson;
