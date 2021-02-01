const cpExec = require('./cpExec');
const dtsRename = require('./dtsRename');


function publishBase(o) {
  dtsRename(o.outDts, o);
  try { cpExec(`npm publish`); }
  catch (e) { console.error(e); }
}
module.exports = publishBase;
