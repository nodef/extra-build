function optionValue(x) {
  try { return JSON.parse(x); }
  catch(e) { return x; }
}
module.exports = optionValue;
