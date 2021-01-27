const optionSet = require('./optionSet');


function optionRead(o, k, a, i) {
  if (k === '--');
  else if (k.startsWith('--')) i = optionSet(o, k.substring(2), a, i);
  else if (k.startsWith('-')) i = optionSet(o, k.substring(1), a, i);
  else o.command = a[i];
  return i+1;
}
module.exports = optionRead;
