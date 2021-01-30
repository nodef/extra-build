const mdReplace = require('./mdReplace');
const eolSet = require('./eolSet');


// Sets wiki from JSDoc.
function mdSetJsdoc(md, jsdoc, o) {
  var {type, description, params, returns} = jsdoc, o = o||{};
  var isFn = type==='function';
  var pre = Math.max(...[...params.keys()].map(v => v.length));
  var args = [...params].filter(([k]) => k.indexOf('.')<0).map(([k, v]) => v.type.startsWith('...')? `...${k}`:(v.type.endsWith('?')? `[${k}]`:k));
  var pars = [...params].map(([k, v]) => `// ${(k.replace(/.*?\./, '.')+':').padEnd(pre+2)}${v.description}`);
  var def =
    '```javascript\n'+
    `${o.symbol}` + (isFn? `(`+args.join(', ')+`)`:'') + ';\n'+
    (isFn? pars.join('\n')+'\n' : '')+
    (returns? `// --> `+returns.description+'\n':'')+
    '```\n';
  md = eolSet(md, '\n')||'Blank.\n\n```javascript\n```\n';
  md = md.replace(/^.*?\n/, m => mdReplace(m, description)+'\n');
  md = md.replace(/```javascript[\s\S]*?```\n/, def);
  return eolSet(md);
}
module.exports = mdSetJsdoc;
