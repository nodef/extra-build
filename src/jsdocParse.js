/**
 * Parse JSDoc comment.
 * @param {string} com JSDoc comment
 * @param {string} def function definition
 * @param {string} loc location information (?)
 */
function jsdocParse(com, def, loc='?') {
  var description = com.match(/\s+\*\s+(.*?)\r?\n/)[1], err = null;
  // params
  var rparam = /\s+\*\s+@param\s+(?:\{(.*?)\}\s+)?(.*?)\s+(.*?)\r?\n/g;
  var params = new Map(), m = null;
  while ((m=rparam.exec(com)) != null) {
    params.set(m[2], {type: m[1]||'*', description: m[3]});
    if (!m[2].includes('.')) continue;
    var k = m[2].replace(/\..*/, '');
    if (params.has(k)) params.get(k).type += '?';
    else {
      console.error(`JSDocParseError: Parse failed for ${loc}`);
      console.error(`No such @param ${err=k}`);
    }
  }
  // returns
  var rreturns = /\s+\*\s+@returns\s+(?:\{(.*?)\}\s+)?(.*?)\r?\n/;
  var m = rreturns.exec(com);
  var returns = m? {type: m[1], description: m[2]}:null;
  // definition
  var rarg = /\s*([\.\w$?]+)\s*(\:[^=]+)?=?(.*)/;
  var args = def.replace(/[^(]*\(?/, '').replace(/\).*/, '');
  args = args.replace(/<.*?>/g, '').replace(/\[.*?\]/g, '');
  args = /^(const|var|let)\s/.test(def)? '' : args;
  var type = args? 'function' : 'variable';
  if (args) for(var a of args.split(/,\s*/g)) {
    var m = rarg.exec(a);
    if (m==null) continue;
    var [, id,, val] = m;
    var k = id.replace(/[^\w$]/g, '');
    var f = params.get(k);
    if (!f) {
      console.error(`JSDocParseError: Parse failed for ${loc}`);
      console.error(`No such argument ${err=k}`);
      continue;
    }
    if (id.startsWith('...')) f.type = '...'+f.type;
    if (id.endsWith('?') || val) f.type += '?';
  }
  if (err) {
    console.error(com);
    console.error(def);
  }
  return {type, description, params, returns};
}
module.exports = jsdocParse;
