const urlWiki = require('./urlWiki');
const fileRead = require('./fileRead');
const mdCodeBlocks = require('./mdCodeBlocks');
const jsdocText = require('./jsdocText');
const jsdocComment = require('./jsdocComment');
const path = require('path');


/**
 * Add Wiki Link to JSDocs.
 * @param {string} js js data
 * @param {object} o options
 */
function jsLinkWiki(js, o) {
  var re = /(\/\*\*.*?\*\/).*?((export\s+)?(?:(function\*?|class|const|var|let)\s+)?([\w$]+)([^\{;]*))/gs;
  var c = null, cls = '';
  return js.replace(re, (m, com, def, exp, typ, nam, arg) => {
    if(!exp) return m;
    if(typ==='class') cls = nam;
    if(nam==='constructor') nam = cls;
    if (m.includes(urlWiki(nam, o))) return m;
    c = addExample(com, nam, o);
    c = addWikiLink(c, nam, o);
    return m.replace(com, c);
  });
}

function addWikiLink(com, nam, o) {
  var re = /(\s+\*\s+)(.*?)\n/;
  return com.replace(re, `$1$2$1[📘](${urlWiki(nam, o)})\n`);
}

function addExample(com, nam, o) {
  if (!com.includes('@example')) return com;
  var pth = path.join(o.wikiDir, nam+'.md');
  var md = fileRead(pth);
  var [, ex] = mdCodeBlocks(md)
  ex = exampleSimplify(ex, nam, o);
  com = jsdocText(com);
  com += '@example\n```javascript\n'+ex.trim()+'\n```\n';
  return jsdocComment(com);
}

function exampleSimplify(ex, nam, o) {
  var re = new RegExp(`${nam}\\.`, 'g');
  ex = ex.replace(`const ${nam} = require("${o.nameRoot}");`, '');
  ex = ex.replace(re, '');
  return ex.trim();
}
module.exports = jsLinkWiki;
