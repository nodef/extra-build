/**
 * Removes JSDoc comment characters.
 * @param {string} com JSDoc comment
 */
function jsdocText(com) {
  var re = /\s*\/?\*+\/?\s*/g;
  return com.replace(re, '\n').trim();
}
module.exports = jsdocText;
