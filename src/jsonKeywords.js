// Removes non-base keywords from package.json.
function jsonKeywords(x, ks) {
  var ks0 = x.keywords.slice();
  var ks1 = ks||[];
  for(var k of ks1) {
    var i = ks0.indexOf(k);
    if(i>=0) ks0.length = Math.min(ks0.length, i);
  }
  return ks0;
}
module.exports = jsonKeywords;
