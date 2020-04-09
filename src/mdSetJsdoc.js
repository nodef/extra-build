const mdReplace = require('./mdReplace');


// Sets wiki from JSDoc.
function mdSetJsdoc(md, jsdoc, o) {
  var {description, params, returns} = jsdoc, o = o||{};
  var pre = Math.max(...[...params.keys()].map(v => v.length));
  var args = [...params].filter(([k]) => k.indexOf('.')<0).map(([k, v]) => v.type.startsWith('...')? `...${k}`:(v.type.endsWith('?')? `[${k}]`:k));
  var pars = [...params].map(([k, v]) => `// ${(k.replace(/.*?\./, '.')+':').padEnd(pre+2)}${v.description}`);
  var def =
    '```javascript\n'+
    `${o.symbol_root}.${o.symbol}(`+args.join(', ')+`);\n`+
    pars.join('\n')+'\n'+
    (returns? `// --> `+returns.description+'\n':'')+
    '```\n';
  md = md||'Blank.\n\n```javascript\n```\n';
  md = md.replace(/^.*?\n/, m => mdReplace(m, description)+'\n');
  md = md.replace(/```javascript[\s\S]*?```\n/, def);
  return md;
}
module.exports = mdSetJsdoc;
