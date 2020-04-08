const packageName = require('./packageName');


function packageUrl(x=packageName) {
  return `https://www.npmjs.com/package/${x}`;
}
module.exports = packageUrl;
