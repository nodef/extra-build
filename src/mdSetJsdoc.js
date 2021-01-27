const mdReplace = require('./mdReplace');
const {EOL} = require('os');


// Sets wiki from JSDoc.
function mdSetJsdoc(md, jsdoc, o) {
  var {type, description, params, returns} = jsdoc, o = o||{};
  var isFn = type==='function';
  var pre = Math.max(...[...params.keys()].map(v => v.length));
  var args = [...params].filter(([k]) => k.indexOf('.')<0).map(([k, v]) => v.type.startsWith('...')? `...${k}`:(v.type.endsWith('?')? `[${k}]`:k));
  var pars = [...params].map(([k, v]) => `// ${(k.replace(/.*?\./, '.')+':').padEnd(pre+2)}${v.description}`);
  var def =
    '```javascript'+EOL+
    `${o.symbolRoot}.${o.symbol}` + (isFn? `(`+args.join(', ')+`)`:'') + ';'+EOL+
    (isFn? pars.join(EOL)+EOL : '')+
    (returns? `// --> `+returns.description+EOL:'')+
    '```'+EOL;
  md = md||'Blank.'+EOL+EOL+'```javascript'+EOL+'```'+EOL;
  md = md.replace(/^.*?\r?\n/, m => mdReplace(m, description)+EOL);
  md = md.replace(/```javascript[\s\S]*?```\r?\n/, def);
  return md;
}
module.exports = mdSetJsdoc;
