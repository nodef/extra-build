const dirRead = require('./dirRead');


function dirKeywords(pth=null) {
  return dirRead(pth||'src').filter(f => {
    return /^_|^index\./.test(f)===false;
  });
}
module.exports = dirKeywords;
