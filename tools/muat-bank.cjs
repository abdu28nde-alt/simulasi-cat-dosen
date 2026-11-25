/* Memuat bank soal di Node (tanpa browser) mengikuti urutan <script> di index.html. */
const fs = require("fs"), vm = require("vm"), path = require("path");
module.exports = function muatBank(root) {
  root = root || path.join(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const files = [...html.matchAll(/<script src="(soal\/[^"]+)"><\/script>/g)].map(m => m[1]);
  const ctx = { console: { info() {}, warn() {}, log() {} } }; ctx.window = ctx; vm.createContext(ctx);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }));
  return { BANK: ctx.BANK, validasi: ctx.validasiBank, ctx, files };
};
