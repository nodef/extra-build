/**
 * Get file name without extension.
 * @param {string} f file name
 */
function fileName(f) {
  return f.replace(/\..*/, '');
}
module.exports = fileName;
