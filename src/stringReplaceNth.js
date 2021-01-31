function stringReplaceNth(x, re, n, fn) {
  var i = -1;
  return x.replace(re, (...m) => ++i !== n? m[0] : fn(...m));
}
module.exports = stringReplaceNth;
