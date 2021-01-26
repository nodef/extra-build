/**
 * Check if path is a non-main file.
 * @param {string} pth path of item
 */
function fileIs(pth) {
  if(pth.endsWith('.md')) return /^\.|^_|^Home\./.test(pth)===false;
  else return /^\.|^_|^index\./.test(pth)===false;
}
module.exports = fileIs;
