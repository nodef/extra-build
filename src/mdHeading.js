/**
 * Get heading from markdown text.
 * @param {string} d markdown data
 */
function mdHeading(d) {
  d = d.replace(/\r?\n[\s\S]*/, '');
  d = d.replace(/[\_\[\]]/g, '');
  d = d.replace(/\*(.*?)\*/g, '$1');
  d = d.replace(/\:.*?\:/g, '');
  return d.trim();
}
module.exports = mdHeading;
