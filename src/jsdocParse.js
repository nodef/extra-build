const console = require('./console');


/**
 * Parse JSDoc comment.
 * @param {string} com JSDoc comment
 * @param {string} def function definition
 * @param {string} loc location information (?)
 */
function jsdocParse(com, def, loc='?') {
  var errs = [];
  com = com.replace(/\s*\/\*\s*|\n\s*\*\s*|\n\s*\*\//g, '');
  var description = getDescription(com);
  var params = getParams(com, errs);
  var returns = getReturns(com);
  var example = getExample(com);
  var type = getType(def);
  var args = getArgs(def);
  updateParams(params, args, errs);
  for (var e of errs) console.error(`JsdocParseError: ${e} (${loc})`);
  if (errs.length>0)  console.error(`${com}\n${def}`);
  return {type, description, params, returns, example};
}


function getDescription(com) {
  var re = /(.*?)\n/;
  var m = re.exec(com);
  return m[1].trim();
}

function getParams(com, errs) {
  var re = /\n@param\s+(?:\{(.*?)\}\s+)?(.*?)\s+(.*?)/g;
  var a = new Map(), m = null;
  while ((m=re.exec(com)) != null) {
    var [, type, name, description] = m;
    type = type||'*';
    a.set(name, {type, description});
    if (!name.includes('.')) continue;
    var k = name.replace(/\..*/, '');
    if (a.has(k)) a.get(k).type += '?';
    else errs.push(`No such @param ${k}`);
  }
  return a;
}

function getReturns(com) {
  var re = /\n@returns\s+(?:\{(.*?)\}\s+)?(.*?)/;
  var m = re.exec(com);
  return m? {type: m[1], description: m[2]} : null;
}

function getExample(com) {
  var re = /\n@example\s+([\s\S]*?)(?:@|$)/;
  var m = re.exec(com);
  return m? m[1].trim() : '';
}


function getType(def) {
  var re = /^(const|var|let)\s/;
  return re.test(def)? 'variable' : 'function';
}

function getArgs(def) {
  def = def.replace(/^[^(]*\(?|\).*$/g, '');
  def = def.replace(/<.*?>|\[.*?\]/g, '');
  var re = /\s*([\.\w$?]+)\s*(\:[^=]+)?=?(.*)/, a = [];
  for(var d of def.split(/,\s*/g)) {
    var m = re.exec(d);
    if (m == null) continue;
    var [, name,, value] = m;
    a.push({name, value})
  }
  return a;
}

function updateParams(params, args, errs) {
  for (var {name, value} of args) {
    var k = name.replace(/[^\w$]/g, '');
    var p = params.get(k);
    if (!p) { errs.push(`No such paramter ${k}`); continue; }
    if (name.startsWith('...')) p.type = '...'+p.type;
    if (name.endsWith('?') || value) p.type += '?';
  }
  return params;
}
module.exports = jsdocParse;
