function jsdocParse(com, def) {
  var description = com.match(/\s+\*\s+(.*?)\r?\n/)[1], err = null;
  // params
  var rparam = /\s+\*\s+@param\s+(?:\{(.*?)\}\s+)?(.*?)\s+(.*?)\r?\n/g;
  var params = new Map(), m = null;
  while((m=rparam.exec(com))!=null) {
    params.set(m[2], {type: m[1]||'*', description: m[3]});
    if(!m[2].includes('.')) continue;
    var k = m[2].replace(/\..*/, '');
    if(params.has(k)) params.get(k).type += '?';
    else console.error('jsdocParse: could not find field', err=k);
  }
  // returns
  var rreturns = /\s+\*\s+@returns\s+(?:\{(.*?)\}\s+)?(.*?)\r?\n/;
  var m = rreturns.exec(com);
  var returns = m? {type: m[1], description: m[2]}:null;
  // definition
  var rarg = /\s*([\.\w$?]+)\s*(\:[^=]+)?=?(.*)/;
  var args = def.replace(/[^(]*\(?/, '').replace(/\).*/, '');
  var type = args? 'function' : 'variable';
  args = args.replace(/<.*?>/g, '');
  args = args.replace(/\[.*?\]/g, '');
  if(args) for(var a of args.split(/,\s*/g)) {
    var m = rarg.exec(a);
    if(m==null) continue;
    var [, id,, val] = m;
    var k = id.replace(/[^\w$]/g, '');
    var f = params.get(k);
    if(!f) { console.error('jsdocError: could not find field', err=k); continue; }
    if(id.startsWith('...')) f.type = '...'+f.type;
    if(id.endsWith('?') || val) f.type += '?';
  }
  if(err) { console.error('jsdocParse:', com, def); throw 0; }
  return {type, description, params, returns};
}
module.exports = jsdocParse;
