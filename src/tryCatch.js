function tryCatch(fn) {
  try { fn(); }
  catch (e) { console.error(e); }
}
module.exports = tryCatch;
