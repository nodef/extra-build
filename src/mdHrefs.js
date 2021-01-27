const RHREF = /\[(.*?)\]:\s+(\w+:\/\/[^\r\n]*)\r?\n/g;


/**
 * Get hrefs in markdown.
 * @param {string} md markdown data
 */
function mdHrefs(md) {
  var a = new Map(), m = null;
  var md = md.replace(/```.*?```/gs, '');
  while((m=RHREF.exec(md))!=null)
    a.set(m[1], m[2]);
  return a;
}
module.exports = mdHrefs;
