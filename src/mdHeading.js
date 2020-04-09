// Gets heading from markdown text.
function mdHeading(d) {
  d = d.replace(/\r?\n[\s\S]*/, '');
  d = d.replace(/[\_\[\]]/g, '');
  d = d.replace(/\*(.*?)\*/g, '$1');
  return d;
}
module.exports = mdHeading;
