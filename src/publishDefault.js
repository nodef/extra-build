const cpExec = require('./cpExec');
const tryCatch = require('./tryCatch');
const publishGithub = require('./publishGithub');


function publishDefault(o) {
  tryCatch(() => { cpExec(`npm publish`); });
  tryCatch(() => { if (o.publishGithub) publishGithub(o); });
}
module.exports = publishDefault;
