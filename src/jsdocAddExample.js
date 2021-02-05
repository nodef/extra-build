const fileRead = require('./fileRead');
const mdCodeBlocks = require('./mdCodeBlocks');
const jsdocDecorate = require('./jsdocDecorate');
const jsdocUndecorate = require('./jsdocUndecorate');
const path = require('path');


function jsdocAddExample(com, nam, o) {
  if (com.includes('@example')) return com;
  var pth = path.join(o.wikiDir, nam+'.md');
  var md = fileRead(pth);
  var [, ex] = mdCodeBlocks(md)
  ex = exampleSimplify(ex, o);
  com = jsdocUndecorate(com);
  com += '\n@example\n```javascript\n'+ex.trim()+'\n```\n';
  return jsdocDecorate(com);
}

function exampleSimplify(ex, o) {
  var rsym = new RegExp(`${o.symbolRoot}\\.`, 'g');
  var rreq = new RegExp(`(const|var)\\s+${o.symbolRoot}\\s*=\\s*require\\(['"]${o.nameRoot}['"]\\);?`);
  if (!o.jsdocExampleRequire) ex = ex.replace(rreq, '');
  if (!o.jsdocExampleSymbol) ex = ex.replace(rsym, '');
  return ex.trim();
}
module.exports = jsdocAddExample;
