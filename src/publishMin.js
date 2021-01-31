const cpExec = require('./cpExec');
const minify = require('./minify');
const tryCatch = require('./tryCatch');
const publishGithub = require('./publishGithub');


function publishMin(o) {
  minify('.', o);
  tryCatch(() => { cpExec(`npm publish`); });
  tryCatch(() => { if (o.publishGithub) publishGithub(o); });
}
module.exports = publishMin;
