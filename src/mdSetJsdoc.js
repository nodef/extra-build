const stringReplaceNth = require('./stringReplaceNth');
const mdReplace = require('./mdReplace');


// Sets wiki from JSDoc.
function mdSetJsdoc(md, jsdoc, o) {
  var {description} = jsdoc;
  if (o.wikiDescription) md = md.replace(/^.*?\n/, m => mdReplace(m, description)+'\n');
  var re = /```javascript([\s\S]*?)```\n/g;
  md = stringReplaceNth(md, re, 0, (m, p1) => {
    if (!o.wikiDefinition && p1.trim().length !== 0) return m;
    return getDefinition(o.symbol, jsdoc);
  });
  md = stringReplaceNth(md, re, 1, (m, p1) => {
    if (!o.wikiExample && p1.trim().length !== 0) return m;
    return getExample(jsdoc);
  });
  return md;
}


function getDefinition(symbol, jsdoc) {
  var args = [], pars = [];
  var {type, params, returns} = jsdoc;
  var pre = Math.max(...[...params.keys()].map(v => v.length));
  for (var [name, value] of params) {
    pars.push(getParamDef(name, value, pre));
    if (!name.includes('.')) args.push(getArgDef(name, value));
  }
  var isFn = type === 'function';
  return ''+
    '```javascript\n'+
    `${symbol}` + (isFn? `(`+args.join(', ')+`)`:'') + ';\n'+
    (isFn? pars.join('\n')+'\n' : '')+
    (returns? `// → `+returns.description+'\n':'')+
    '```\n';
}

function getArgDef(name, value) {
  if (value.type.startsWith('...')) return `...${name}`;
  if (value.type.endsWith('?')) return `[${name}]`;
  return name;
}

function getParamDef(name, value, pre) {
  var k = name.replace(/.*?\./, '.');
  var l = (k+':').padEnd(pre+1);
  return `// ${l} ${value.description}`;
}

function getExample(jsdoc) {
  var {example} = jsdoc;
  return ''+
    '```javascript\n'+
    `${example||''}\n`+
    '```\n';
}
module.exports = mdSetJsdoc;
