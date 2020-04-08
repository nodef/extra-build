const fs = require('fs');


function jsonSetKeywords(ks) {
  var d = fs.readFileSync('package.json', 'utf8');
  var p = JSON.parse(d), {keywords} = p;
  for(var k of ks) {
    var i = keywords.indexOf(k);
    if(i>=0) keywords.length = Math.min(keywords.length, i);
  }
  p.keywords = [...keywords, ...ks];
  var d = JSON.stringify(p, null, 2)+'\n';
  fs.writeFileSync('package.json', d);
}
module.exports = jsonSetKeywords;
