const RDELTA = /([^A-Z])([A-Z])|(\D)(\d)/g;
const RTRIM  = /^[^a-zA-Z0-9\.]+|[^a-zA-Z0-9\.]+$/g;
const RSEP   = /[^a-zA-Z0-9\.]+/g;


/**
 * Convert string to kebab-case.
 * @param {string} x string
 * @param {string} sep separator [-]
 * @returns {string} string in kebab-case
 */
function kebabCase(x, sep='-') {
  x = x.replace(RDELTA, `$1$3${sep}$2$4`);
  x = x.replace(RSEP, sep);
  x = x.replace(RTRIM, '');
  return x.toLowerCase();
}
module.exports = {
  kebabCase
};
