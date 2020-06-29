const RHREF = /\[(.*?)\]:\s+(\w+:\/\/.*?)[\r\n]/g;

function mdFilterHrefs(x, fn) {
  return x.replace(RHREF, (m, p1, p2) => {
    var keep = fn(p2, p1);
    if(!keep) console.log('mdFilterHrefs: remove', p1, p2);
    return keep? m : '';
  });
}
module.exports = mdFilterHrefs;
