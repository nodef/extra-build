const cpExec = require('./cpExec');
const packageRoot = require('./packageRoot');

const OPTIONS = {
  config: true,
  format: 'es',
  input: 'src/index.js'
};


function execRollup(pth, o) {
  var pth = pth||'index.js';
  var o = Object.assign({output: pth}, OPTIONS, o);
  console.log('execRollup:', pth, o);
  var cwd = packageRoot(pth);
  if(o.config) cpExec(`.rollup -c`, {cwd});
  else cpExec(`.rollup -f ${o.format} --file=${o.output} -- "${o.input}"`, {cwd});
}
module.exports = execRollup;
