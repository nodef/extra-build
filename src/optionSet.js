const dotProp = require('dot-prop');
const optionValue = require('./optionValue');


function optionSet(o, k, a, i) {
  var s = k.indexOf('=');
  if (s >= 0) dotProp.set(o, k.substring(0, s), optionValue(k.substring(s+1))); // --k=v
  else if (i+1 === a.length || a[i+1].startsWith('-')) dotProp.set(o, k, true); // --k
  else dotProp.set(o, k, optionValue(a[++i])); // --k v
  return i;
}
module.exports = optionSet;
