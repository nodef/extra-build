/**
 * Get heading from markdown text.
 * @param {string} md markdown data
 */
function mdHeading(md) {
  md = md.replace(/\n[\s\S]*/, '');
  md = md.replace(/[\_\[\]]/g, '');
  md = md.replace(/\*(.*?)\*/g, '$1');
  md = md.replace(/\:.*?\:/g, '');
  md = md.replace(/<br>/g, '');
  return md.trim();
}
module.exports = mdHeading;
