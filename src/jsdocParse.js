function jsdocParse(com, def) {
  var description = com.match(/\s+\*\s+(.*?)\n/)[1];
  // params
  var rparam = /\s+\*\s+@param\s+(?:\{(.*?)\}\s+)?(.*?)\s+(.*?)\n/g;
  var params = new Map(), m = null;
  while((m=rparam.exec(com))!=null) {
    params.set(m[2], {type: m[1]||'*', description: m[3]});
    if(!m[2].includes('.')) continue;
    var k = m[2].replace(/\..*/, '');
    params.get(k).type += '?';
  }
  // returns
  var rreturns = /\s+\*\s+@returns\s+(?:\{(.*?)\}\s+)?(.*?)\n/;
  var m = rreturns.exec(com);
  var returns = m? {type: m[1], description: m[2]}:null;
  // definition
  var rarg = /\s*([\.\w$?]+)\s*(\:[^=]+)?=?(.*)/;
  var args = def.replace(/[^(]*\(?/, '').replace(/\).*/, '');
  var type = args? 'function' : 'variable';
  args = args.replace(/<.*?>/g, '');
  if(args) for(var a of args.split(/,\s*/g)) {
    var m = rarg.exec(a);
    if(m==null) continue;
    var [, id,, val] = m;
    var k = id.replace(/[^\w$]/g, '');
    var f = params.get(k);
    if(!f) {
      console.error('jsdocParse:', com, def);
      console.error('could not find field '+k);
      continue;
    }
    if(id.startsWith('...')) f.type = '...'+f.type;
    if(id.endsWith('?') || val) f.type += '?';
  }
  return {type, description, params, returns};
}
module.exports = jsdocParse;
