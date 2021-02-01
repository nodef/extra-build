const publishBase = require('./publishBase');
const publishGithub = require('./publishGithub');


function publishDefault(o) {
  publishBase(o);
  if (o.publishGithub) publishGithub(o);
}
module.exports = publishDefault;
