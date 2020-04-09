const cpExec = require('./cpExec');

const OPTIONS = {
  config: true,
  format: 'es',
  input: 'src/index.js'
};


function updateMain(pth, o) {
  var pth = pth||'index.js';
  var o = Object.assign({output: pth}, OPTIONS, o);
  console.log('updateMain:', pth, o);
  if(o.config) cpExec(`.rollup -c`);
  else cpExec(`.rollup -f ${o.format} --file=${o.output} -- "${o.input}"`);
}
module.exports = updateMain;
