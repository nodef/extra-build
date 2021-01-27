const RHREF = /\[(.*?)\]:\s+([^\r\n]+)\r?\n/g;


/**
 * Filter hrefs in markdown.
 * @param {string} md markdown data
 * @param {function} fn keep href (name, url)?
 */
function mdFilterHref(md, fn) {
  return md.replace(RHREF, (m, p1, p2) => {
    var keep = fn(p2, p1);
    if(!keep) console.log('mdFilterHrefs: remove', p1, p2);
    return keep? m : '';
  });
}
module.exports = mdFilterHref;
