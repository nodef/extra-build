const execTsc = require('./execTsc');

const OPTIONS = {
  outDir: 'out'
};


function updateSrc(pth, o) {
  var pth = pth||'src/index.js';
  var o = Object.assign({}, OPTIONS, o);
  console.log('updateSrc:', pth, o);
  execTsc(pth, o);
}
module.exports = updateSrc;
