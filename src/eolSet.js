const {EOL} = require('os');

function eolSet(x, c=EOL) {
  return x.replace(/\r?\n/g, c);
}
module.exports = eolSet;
