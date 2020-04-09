function symbolName(x, o) {
  var x = x.replace(/^extra-/, ''), o = o||{};
  if(!o.symbol_root) return x;
  return `${o.symbol_root}.${x}`;
}
module.exports = symbolName;
