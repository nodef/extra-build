function snakeCase(x, sep='-') {
  x = x.replace(/([a-z0-9])([A-Z])/g, '$1'+sep+'$2');
  x = x.replace(/[^A-Za-z0-9\.]+/g, sep);
  x = x.replace(/^[^A-Za-z0-9\.]+/, '');
  x = x.replace(/[^A-Za-z0-9\.]+$/, '');
  return x.toLowerCase();
}
module.exports = snakeCase;
