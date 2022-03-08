/**
 * Undecorate jsdoc by removing stars.
 * @param {string} txt jsdoc text
 * @returns {string} undecorated jsdoc
 */
function undecorate(txt) {
  txt = txt.replace(/^\s*\/\*\*|\*\/\s*$/g, '');
  txt = txt.replace(/^[ \t]*\*[ \t]*|[ \t*]$/gm, '');
  return txt.trim();
}


/**
 * Decorates an undecorated jsdoc by adding stars.
 * @param {string} txt undecorated jsdoc
 * @returns {string} jsdoc text
 */
function decorate(txt) {
  txt = txt.split('\n').map(l => ' * ' + l.trim()).join('\n');
  return '/**\n' + txt + ' */\n';
}


/** Regex for description: [full] */
const RDESCRIPTION = /^([\s\S]*?)(?=@|$)/g;
/** Regex for param tag: [name, type, description]. */
const RPARAM   = /^@param(?:[ \t]+(\w+))(?:[ \t]+\{(.*?)\})?(?:[ \t]+(.*?))?$/gm;
/** Regex for returns tag: [type, description]. */
const RRETURNS = /^@returns(?:[ \t]+\{(.*?)\})?(?:[ \t]+(.*?))?$/gm;
/** Regex for example tag: [full]. */
const REXAMPLE = /@example\n(```[\s\S]*?\n```\n|(?:(?: {4}|\t).*?\n)+)?/g;


/**
 * @typedef ParamTag
 * @prop {string} full full param
 * @prop {string} name param name
 * @prop {string} type param type
 * @prop {string} description param description
 */
/**
 * @typedef ReturnsTag
 * @prop {string} full full returns
 * @prop {string} type returns type
 * @prop {string} description returns description
 */
/**
 * @typedef Jsdoc
 * @prop {string} full full jsdoc
 * @prop {string} description jsdoc description
 * @prop {ParamTag[]} params jsdoc params
 * @prop {ReturnsTag} returns jsdoc returns
 * @prop {string[]} examples jsdoc examples
 */
/**
 * Parse jsdoc from jsdoc text.
 * @param {string} txt jsdoc text
 * @returns {Jsdoc} parsed jsdoc
 */
function parse(txt) {
  var full = txt;
  var txt  = undecorate(txt), m = null;
  var description = '', params = [];
  var returns = null, examples = [];
  while ((m = RDESCRIPTION.exec(txt)) != null)
    description = m[1] || '';
  while ((m = RPARAM.exec(txt)) != null)
    params.push({full: m[0], name: m[1], type: m[2] || '', description: m[3] || ''});
  while ((m = RRETURNS.exec(txt)) != null)
    returns = {full: m[0], type: m[1] || '', description: m[2] || ''};
  while ((m = REXAMPLE.exec(txt)) != null)
    if (m[1]) examples.push(m[1]);
  return {full, description, params, returns, examples};
}


/**
 * Stringify jsdoc text from jsdoc.
 * @param {Jsdoc} x parsed jsdoc
 * @returns {string} jsdoc text
 */
function stringify(x) {
  var txt = x.description.trim() + '\n';
  for (var p of x.params)
    txt += ('@param' + ` ${p.name}` + (p.type? ` {${p.type}}` : '') + ` ${p.description}`).trim() + '\n';
  for (var r of x.returns? [x.returns] : [])
    txt += ('@returns' + (r.type? ` {${r.type}}` : '') + ` ${r.description}`).trim() + '\n';
  for (var e of x.examples)
    txt += `@example\n${e.trim()}\n`;
  return decorate(txt);
}
module.exports = {
  undecorate, decorate,
  parse, stringify,
};
