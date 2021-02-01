const minify = require('./minify');
const publishDefault = require('./publishDefault');


function publishMin(o) {
  minify('.', o);
  publishDefault(o);
}
module.exports = publishMin;
