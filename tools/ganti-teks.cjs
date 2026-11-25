/* Mengganti teks opsi secara persis di berkas soal.
   Pemakaian: node tools/ganti-teks.cjs soal/berkas.js peta.json
   peta.json = { "teks lama persis": "teks baru", ... } — setiap teks lama harus muncul tepat sekali. */
const fs = require("fs");
const [, , f, petaF] = process.argv;
let s = fs.readFileSync(f, "utf8");
const peta = JSON.parse(fs.readFileSync(petaF, "utf8"));
let n = 0;
for (const [lama, baru] of Object.entries(peta)) {
  const q = JSON.stringify(lama), c = s.split(q).length - 1;
  if (c !== 1) { console.error("Tidak unik/tidak ada (" + c + "):", lama); process.exitCode = 1; continue; }
  s = s.replace(q, JSON.stringify(baru)); n++;
}
fs.writeFileSync(f, s);
console.log("diganti:", n);
