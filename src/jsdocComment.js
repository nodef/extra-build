/**
 * Add JSDoc comment characters.
 * @param {string} com JSDoc comment text
 */
function jsdocComment(com) {
  var ls = com.trim().split('\n');
  return `/**\n * ${ls.join('\n * ')}\n */`;
}
module.exports = jsdocComment;
