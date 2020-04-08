// Reads JSDoc in js file.
function jsJsdoc(js) {
  var c = js.replace(/.*?(\/\*\*.*?\*\/).*/s, '$1');
  if(c.length===js.length) return null;
  var description = c.match(/\s+\*\s+(.*?)\n/)[1];
  var rparam = /\s+\*\s+@param\s+(?:\{(.*?)\}\s+)(.*?)\s+(.*?)\n/g;
  var params = new Map(), m = null;
  while((m=rparam.exec(c))!=null) {
    params.set(m[2], {type: m[1], description: m[3]});
    if(!m[2].includes('.')) continue;
    var k = m[2].replace(/\..*/, '');
    params.get(k).type += '?';
  }
  var rreturns = /\s+\*\s+@returns\s+(?:\{(.*?)\}\s+)(.*?)\n/;
  m = rreturns.exec(c);
  var returns = m? {type: m[1], description: m[2]}:null;
  var next = js.substring(js.indexOf(c)+c.length);
  var name = next.replace(/.*?function\*?\s+(.*?)\(.*/s, '$1');
  return {description, params, returns, name};
}
module.exports = jsJsdoc;
