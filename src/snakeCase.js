const RDELTA = /([^A-Z])([A-Z])|(\D)(\d)/g;
const RTRIM  = /^[^a-zA-Z0-9\.]+|[^a-zA-Z0-9\.]+$/g;
const RSEP   = /[^a-zA-Z0-9\.]+/g;

function snakeCase(x, sep='-') {
  x = x.replace(RDELTA, '$1$3'+sep+'$2$4');
  x = x.replace(RSEP, sep);
  x = x.replace(RTRIM, '');
  return x.toLowerCase();
}
module.exports = snakeCase;
