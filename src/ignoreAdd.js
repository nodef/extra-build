const fileRead = require('./fileRead');
const fs = require('fs');
const {EOL} = require('os');


/**
 * Add sections to ignore file.
 * @param {string} pth path of ignore file
 * @param {Map<string, Array<string>>} sections named ignore sections
 */
function ignoreAdd(pth, sections) {
  var d = fileRead(pth), n = 0, a = '';
  for(var [k, ls] of sections) {
    if(d.includes('# '+k)) continue;
    a += '# '+k+EOL;
    a += ls.join(EOL)+EOL+EOL;
    n++;
  }
  if(n === 0) return;
  fs.writeFileSync(pth, a+d);
  console.log(`Added ${n} sections to ignore file ${pth}`);
}
module.exports = ignoreAdd;
