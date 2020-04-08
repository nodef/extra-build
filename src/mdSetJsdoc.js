const mdReplace = require('./mdReplace');


// Sets wiki from JSDoc.
function mdSetJsdoc(md, o) {
  var pre = Math.max(...[...o.params.keys()].map(v => v.length));
  var args = [...o.params].filter(([k]) => k.indexOf('.')<0).map(([k, v]) => v.type.startsWith('...')? `...${k}`:(v.type.endsWith('?')? `[${k}]`:k));
  var pars = [...o.params].map(([k, v]) => `// ${(k.replace(/.*?\./, '.')+':').padEnd(pre+2)}${v.description}`);
  var def =
    '```javascript\n'+
    `${o.name_root}.${o.name}(`+args.join(', ')+`);\n`+
    pars.join('\n')+'\n'+
    (o.returns? `// --> `+o.returns.description+'\n':'')+
    '```\n';
  md = md||'Blank.\n\n```javascript\n```\n';
  md = md.replace(/^.*?\n/, m => mdReplace(m, o.description)+'\n');
  md = md.replace(/```javascript[\s\S]*?```\n/, def);
  return md;
}
module.exports = mdSetJsdoc;
