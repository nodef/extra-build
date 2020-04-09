const fileName = require('./fileName');


function fileId(f) {
  return fileName(f).replace(/[^\w$]/g, '');
}
module.exports = fileId;
