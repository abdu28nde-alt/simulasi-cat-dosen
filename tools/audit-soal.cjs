/* Audit independen bank soal.
   Menghitung ulang kunci soal otomatis (TIU numerik, TIU figural tertentu, SKB Penalaran)
   langsung dari TEKS soal — bukan dari generator — lalu memeriksa duplikasi dan kualitas opsi.
   Jalankan: node tools/audit-soal.cjs [--md AUDIT-SOAL.md]                                   */
const muat = require("./muat-bank.cjs");
const { BANK } = muat();
const KODE = ["A", "B", "C", "D", "E"];
const bersih = s => String(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const angka = s => { // format id-ID -> Number
  s = String(s).replace(/<[^>]+>/g, "").replace(/Rp/g, "").replace(/%/g, "").replace(/\s/g, "");
  if (/^-?[\d.]+,\d+$/.test(s)) return Number(s.replace(/\./g, "").replace(",", "."));
  if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ""));
  return Number(s.replace(",", "."));
};
const kunciTeks = q => q.opsi.find(o => o.skor === 5).teks;
const dekat = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 1e-6 : tol);
const hasil = { ok: [], salah: [], ambigu: [], manual: [], duplikat: [], opsi: [] };
function catat(jenis, q, ket) { hasil[jenis].push({ id: q.id, subtopik: q.subtopik, ket }); return true; }

/* ---------- pemecah per jenis ---------- */
function hitungEkspresi(t) {
  let e = bersih(t).replace(/=\s*…/, "").trim();
  let m;
  if ((m = e.match(/^(\d+)\/(\d+) dari (\d+)\/(\d+) dari ([\d.]+) adalah/))) return m[1] / m[2] * m[3] / m[4] * angka(m[5]);
  if ((m = e.match(/^Jika (\d+)% dari suatu bilangan adalah ([\d.,]+), bilangan tersebut/))) return angka(m[2]) * 100 / Number(m[1]);
  e = String(t).replace(/=\s*…/, "").replace(/<sup>(\d+)<\/sup>/g, "**$1").replace(/³/g, "**3").replace(/√(\d+)/g, "Math.sqrt($1)")
    .replace(/(\d+)%/g, "($1/100)").replace(/×/g, "*").replace(/ : /g, "/").replace(/:/g, "/").replace(/−/g, "-");
  e = e.replace(/(\d)\.(\d{3})(?!\d)/g, "$1$2").replace(/(\d),(\d)/g, "$1.$2");
  if (!/^[\d\s+\-*/().Mathsqr]+$/.test(e)) return NaN;
  return Function("return (" + e + ")")();
}
function polaDeret(xs) {
  const pred = new Set(), n = xs.length, d = xs.slice(1).map((v, i) => v - xs[i]);
  const tambah = v => { if (Number.isFinite(v)) pred.add(Math.round(v * 1e6) / 1e6); };
  if (d.every(v => v === d[0])) tambah(xs[n - 1] + d[0]);
  if (xs.every(v => v !== 0)) { const r = xs.slice(1).map((v, i) => v / xs[i]); if (r.every(v => dekat(v, r[0]))) tambah(xs[n - 1] * r[0]); }
  if (n >= 3 && xs[1] !== xs[0]) { const m = (xs[2] - xs[1]) / (xs[1] - xs[0]), c = xs[1] - m * xs[0]; if (Number.isInteger(m) && m > 1 && xs.slice(1).every((v, i) => dekat(v, m * xs[i] + c))) tambah(m * xs[n - 1] + c); }
  const d2 = d.slice(1).map((v, i) => v - d[i]); if (d2.length >= 2 && d2.every(v => v === d2[0]) && d2[0] !== 0) tambah(xs[n - 1] + d[d.length - 1] + d2[0]);
  if (n >= 6) { const gj = xs.filter((_, i) => i % 2 === 0), gn = xs.filter((_, i) => i % 2 === 1), dg = gj.slice(1).map((v, i) => v - gj[i]), dn = gn.slice(1).map((v, i) => v - gn[i]);
    if (dg.every(v => v === dg[0]) && dn.every(v => v === dn[0]) && dg[0] !== dn[0]) tambah(n % 2 === 0 ? gj[gj.length - 1] + dg[0] : gn[gn.length - 1] + dn[0]); }
  if (n >= 4 && xs.slice(2).every((v, i) => v === xs[i] + xs[i + 1])) tambah(xs[n - 1] + xs[n - 2]);
  return [...pred];
}
function cekDeret(q) {
  const t = bersih(q.pertanyaan).replace(/^Suku berikutnya dari deret /, "").replace(/, ….*$/, "");
  const parts = t.split(",").map(s => s.trim()), huruf = parts.every(p => /^[A-Z]$/.test(p));
  const xs = huruf ? parts.map(p => p.charCodeAt(0) - 65) : parts.map(angka);
  const pr = polaDeret(xs), k = kunciTeks(q), kv = huruf ? k.charCodeAt(0) - 65 : angka(k);
  if (!pr.length) return catat("manual", q, "pola deret tidak dikenali oleh pemeriksa: " + t);
  if (!pr.some(p => dekat(p, kv))) return catat("salah", q, "kunci " + k + " tidak cocok dengan pola; prediksi " + pr.join("/"));
  if (pr.length > 1) catat("ambigu", q, "lebih dari satu pola masuk akal: " + pr.join(" / "));
  const lain = q.opsi.filter(o => o.skor !== 5).map(o => huruf ? o.teks.charCodeAt(0) - 65 : angka(o.teks));
  if (lain.some(v => pr.some(p => dekat(p, v)))) return catat("salah", q, "pengecoh juga cocok dengan pola alternatif");
  catat("ok", q, "deret");
}
function nilaiSisi(s) {
  s = s.trim(); let m;
  if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
  if ((m = s.match(/^(\d+)% dari (\d+)$/))) return m[1] * m[2] / 100;
  if ((m = s.match(/^√(\d+)$/))) return Math.sqrt(+m[1]);
  if ((m = s.match(/^(\d+)<sup>(\d+)<\/sup>$/))) return Math.pow(+m[1], +m[2]);
  if ((m = s.match(/^keliling persegi dengan sisi (\d+) cm$/))) return 4 * m[1];
  if ((m = s.match(/^keliling persegi panjang (\d+) cm × (\d+) cm$/))) return 2 * (+m[1] + +m[2]);
  if (/^-?[\d.,]+$/.test(s)) return angka(s);
  return NaN;
}
function cekPK(q) {
  const baris = q.pertanyaan.split("<br>").map(s => s.trim()).filter(Boolean).slice(1, 3);
  let x = NaN, y = NaN;
  baris.forEach(b => { let m;
    if ((m = b.match(/^(\d+)x \+ (\d+) = (\d+)$/))) x = (m[3] - m[2]) / m[1];
    else if ((m = b.match(/^x = (.+)$/))) x = nilaiSisi(m[1]);
    else if ((m = b.match(/^y = (.+)$/))) y = nilaiSisi(m[1]); });
  if (!Number.isFinite(x) || !Number.isFinite(y)) return catat("manual", q, "tidak dapat mengurai x/y");
  const benar = dekat(x, y) ? "x = y" : x > y ? "x > y" : "x < y";
  if (kunciTeks(q) !== benar) return catat("salah", q, "x=" + x + ", y=" + y + " → seharusnya " + benar);
  if (dekat(2 * x, y)) return catat("salah", q, "opsi 2x = y juga benar");
  catat("ok", q, "PK");
}
function cekCerita(q) {
  const t = bersih(q.pertanyaan), k = angka(kunciTeks(q)); let m, v = NaN;
  if ((m = t.match(/dalam (\d+) hari, sedangkan staf B dalam (\d+) hari/))) v = m[1] * m[2] / (+m[1] + +m[2]);
  else if ((m = t.match(/rata-rata (\d+) km\/jam .* dengan (\d+) km\/jam/))) v = 2 * m[1] * m[2] / (+m[1] + +m[2]);
  else if ((m = t.match(/seharga Rp([\d.]+) dan menjualnya dengan keuntungan (\d+)%/))) v = angka(m[1]) * (100 + +m[2]) / 100;
  else if ((m = t.match(/dijual Rp([\d.]+) dengan keuntungan (\d+)% dari harga beli/))) v = angka(m[1]) * 100 / (100 + +m[2]);
  else if ((m = t.match(/nilai (\d+) mahasiswa kelas A adalah (\d+), sedangkan rata-rata (\d+) mahasiswa kelas B adalah (\d+)/))) v = (m[1] * m[2] + m[3] * m[4]) / (+m[1] + +m[3]);
  else if ((m = t.match(/sekarang (\d+) kali umur anaknya\. (\d+) tahun lagi, umur dosen tersebut (\d+) kali/))) v = (m[3] - 1) * m[2] / (m[1] - m[3]);
  else if ((m = t.match(/Rata-rata (\d+) nilai kuis seorang mahasiswa adalah (\d+)\. Agar rata-ratanya menjadi (\d+)/))) v = (+m[1] + 1) * m[3] - m[1] * m[2];
  else if ((m = t.match(/dalam (\d+) hari\. Jika keduanya bekerja bersama/)) && (m = t.match(/A dapat .* dalam (\d+) hari, sedangkan staf B dalam (\d+) hari/))) v = m[1] * m[2] / (+m[1] + +m[2]);
  if (!Number.isFinite(v)) return catat("manual", q, "pola soal cerita tidak dikenali pemeriksa");
  if (!dekat(v, k, 1e-6)) return catat("salah", q, "hitung ulang = " + v + ", kunci = " + k);
  catat("ok", q, "cerita");
}
function cekNalar(q) {
  const t = q.pertanyaan, b = bersih(t), k = kunciTeks(q); let m, v = NaN;
  if (/persentase<\/b> kelulusan/.test(t)) {
    const rows = [...t.matchAll(/<tr><td>([^<]+)<\/td><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)].map(r => [r[1], r[3] / r[2]]);
    const mx = Math.max(...rows.map(r => r[1])), top = rows.filter(r => dekat(r[1], mx, 1e-9));
    if (top.length !== 1) return catat("salah", q, "lebih dari satu prodi tertinggi");
    return top[0][0] === k ? catat("ok", q, "persen") : catat("salah", q, "seharusnya " + top[0][0]);
  }
  if ((m = b.match(/sebanyak ([\d.]+) orang dan pada tahun \d+ sebanyak ([\d.]+) orang/))) v = Math.abs(angka(m[2]) - angka(m[1])) / angka(m[1]) * 100;
  else if ((m = b.match(/IPK (\d+) mahasiswa kelas reguler adalah ([\d,]+), sedangkan (\d+) mahasiswa kelas internasional ([\d,]+)/))) v = Math.round((m[1] * angka(m[2]) + m[3] * angka(m[4])) / (+m[1] + +m[3]) * 100) / 100;
  else if ((m = b.match(/memiliki (\d+) dosen tetap dan (\d+) mahasiswa aktif\. Agar rasio dosen : mahasiswa paling tinggi 1 : (\d+)/))) v = Math.max(1, Math.ceil(m[2] / m[3]) - m[1]);
  else if ((m = b.match(/diikuti (\d+) mahasiswa\. Setiap ruang berkapasitas (\d+) kursi/))) v = Math.ceil(m[1] / m[2]);
  else if ((m = b.match(/sebesar Rp([\d,]+) juta\. Biaya tetap .* Rp(\d+) juta, sedangkan biaya per peserta Rp([\d,]+) juta/))) v = Math.floor((angka(m[1]) - +m[2]) / angka(m[3]) + 1e-9);
  else if (/indeks prestasi semester/.test(b)) {
    const N = { A: 4, B: 3, C: 2 }; let tot = 0, ts = 0;
    [...t.matchAll(/<tr><td>[^<]+<\/td><td>(\d)<\/td><td>([ABC])<\/td><\/tr>/g)].forEach(r => { tot += r[1] * N[r[2]]; ts += +r[1]; });
    v = Math.round(tot / ts * 100) / 100;
  }
  else if ((m = b.match(/Kelas A: (\d+) mahasiswa, (\d+) lulus\. Kelas B: (\d+) mahasiswa, (\d+) lulus/))) return catat("ok", q, "manual-tertulis");
  if (!Number.isFinite(v)) return catat("manual", q, "pola penalaran tidak dikenali pemeriksa");
  return dekat(v, angka(k), 1e-6) ? catat("ok", q, "nalar") : catat("salah", q, "hitung ulang = " + v + ", kunci = " + k);
}
const POS8 = [[12, 12], [30, 12], [48, 12], [48, 30], [48, 48], [30, 48], [12, 48], [12, 30]];
function posTitik(svg) { const m = svg.match(/<circle cx="(\d+)" cy="(\d+)" r="5.5"/); if (!m) return -1; return POS8.findIndex(p => p[0] == m[1] && p[1] == m[2]); }
function cekFigural(q) {
  const teks = q.opsi.map(o => o.teks);
  if (new Set(teks).size !== 5) return catat("salah", q, "ada gambar opsi kembar");
  if (q.subtopik === "Figural – Serial" && /r="5.5"/.test(q.gambar || "") && !/rotate/.test(q.gambar)) {
    const seq = (q.gambar.match(/<svg[\s\S]*?<\/svg>/g) || []).map(posTitik).filter(p => p >= 0);
    const step = ((seq[1] - seq[0]) % 8 + 8) % 8, okStep = seq.every((p, i) => i === 0 || ((p - seq[i - 1]) % 8 + 8) % 8 === step);
    const exp = (seq[seq.length - 1] + step) % 8, key = posTitik(kunciTeks(q));
    if (!okStep) return catat("manual", q, "langkah titik tidak konstan");
    return key === exp ? catat("ok", q, "figural titik") : catat("salah", q, "posisi kunci " + key + ", seharusnya " + exp);
  }
  if (q.subtopik === "Figural – Serial" && /rotate\(/.test(q.gambar || "") && !/translate/.test(q.gambar)) {
    const sud = [...q.gambar.matchAll(/rotate\((-?\d+) 30 30\)/g)].map(m => ((+m[1] % 360) + 360) % 360);
    const st = ((sud[1] - sud[0]) + 360) % 360, exp = (sud[sud.length - 1] + st) % 360, km = kunciTeks(q).match(/rotate\((-?\d+) 30 30\)/);
    return km && (((+km[1] % 360) + 360) % 360) === exp ? catat("ok", q, "figural panah") : catat("salah", q, "sudut kunci tidak sesuai");
  }
  const v = cekFigLanjut(q); if (v) return v;
  catat("manual", q, "periksa visual (pola " + q.subtopik.replace("Figural – ", "") + ")");
}
/* Membaca atribut gambar SVG buatan generator: bendera (sudut + cermin), bangun (sisi, isi, titik), panah kecil + titik. */
function svgs(html) { return (html || "").match(/<svg[\s\S]*?<\/svg>/g) || []; }
function bendera(svg) { if (svg.indexOf("31,24 44,28 31,33") < 0) return null; const m = svg.match(/<g transform="rotate\((-?\d+) 30 30\)">(<g transform="translate\(60 0\) scale\(-1 1\)">)?/); return m ? { sudut: ((+m[1] % 360) + 360) % 360, cermin: !!m[2] } : null; }
function bangun(svg) {
  const titik = (svg.match(/r="2.8"/g) || []).length;
  const pg = svg.match(/<polygon points="([^"]+)" fill="([^"]+)" stroke/), ci = svg.match(/<circle cx="30" cy="26" r="14" fill="([^"]+)"/);
  if (pg) return { sisi: pg[1].trim().split(/\s+/).length, isi: pg[2] === "currentColor", titik };
  if (ci) return { sisi: 0, isi: ci[1] === "currentColor", titik };
  return null;
}
const ARAH = [315, 0, 45, 90, 135, 180, 225, 270];
function cekFigLanjut(q) {
  const ops = q.opsi.map(o => o.teks), kunci = q.opsi.findIndex(o => o.skor === 5);
  if (q.subtopik === "Figural – Ketidaksamaan") {
    let beda = [];
    const b = ops.map(bendera);
    if (b.every(Boolean)) beda = b.map((x, i) => x.cermin ? i : -1).filter(i => i >= 0);
    else if (ops.every(bangun)) beda = ops.map(bangun).map((x, i) => x.sisi !== x.titik ? i : -1).filter(i => i >= 0);
    else {
      beda = ops.map((s, i) => { const r = s.match(/rotate\((-?\d+) 30 30\)/), p = posTitikTeks(s); return r && p >= 0 && ((+r[1] % 360) + 360) % 360 !== ARAH[p] ? i : -1; }).filter(i => i >= 0);
    }
    if (beda.length !== 1) return catat("salah", q, "jumlah gambar yang melanggar aturan = " + beda.length);
    return beda[0] === kunci ? catat("ok", q, "ketidaksamaan") : catat("salah", q, "gambar berbeda ada di opsi " + KODE[beda[0]]);
  }
  if (q.subtopik === "Figural – Analogi") {
    const g = svgs(q.gambar).filter(s => !/tanda tanya/.test(s));
    const b = g.map(bendera);
    if (b.length === 3 && b.every(Boolean)) {
      let exp;
      if (!b[0].cermin && b[1].cermin) exp = { sudut: (360 - b[2].sudut) % 360, cermin: true };
      else exp = { sudut: (b[2].sudut + (b[1].sudut - b[0].sudut) + 720) % 360, cermin: false };
      const cocok = ops.map(bendera).map((x, i) => x && x.sudut === exp.sudut && x.cermin === exp.cermin ? i : -1).filter(i => i >= 0);
      if (cocok.length !== 1) return catat("salah", q, "opsi yang sesuai transformasi = " + cocok.length);
      return cocok[0] === kunci ? catat("ok", q, "analogi bendera") : catat("salah", q, "seharusnya opsi " + KODE[cocok[0]]);
    }
    const s = g.map(bangun);
    if (s.length === 3 && s.every(Boolean)) {
      const exp = { sisi: s[2].sisi, isi: s[1].isi !== s[0].isi ? !s[2].isi : s[2].isi, titik: s[2].titik + (s[1].titik - s[0].titik) };
      const cocok = ops.map(bangun).map((x, i) => x && x.sisi === exp.sisi && x.isi === exp.isi && x.titik === exp.titik ? i : -1).filter(i => i >= 0);
      if (cocok.length !== 1) return catat("salah", q, "opsi yang sesuai transformasi = " + cocok.length);
      return cocok[0] === kunci ? catat("ok", q, "analogi bangun") : catat("salah", q, "seharusnya opsi " + KODE[cocok[0]]);
    }
  }
  if (q.subtopik === "Figural – Serial") {
    const s = svgs(q.gambar).filter(x => !/tanda tanya/.test(x)).map(bangun);
    if (s.length === 4 && s.every(Boolean)) {
      const st = s[1].titik - s[0].titik, alt = s[0].isi !== s[1].isi;
      const exp = { sisi: s[3].sisi, titik: s[3].titik + st, isi: alt ? !s[3].isi : s[3].isi };
      const cocok = ops.map(bangun).map((x, i) => x && x.sisi === exp.sisi && x.isi === exp.isi && x.titik === exp.titik ? i : -1).filter(i => i >= 0);
      if (cocok.length !== 1) return catat("salah", q, "opsi yang sesuai pola = " + cocok.length);
      return cocok[0] === kunci ? catat("ok", q, "serial bangun") : catat("salah", q, "seharusnya opsi " + KODE[cocok[0]]);
    }
  }
  return null;
}
function posTitikTeks(svg) { const m = svg.match(/<circle cx="(\d+)" cy="(\d+)" r="5.5"/); if (!m) return -1; return POS8.findIndex(p => p[0] == m[1] && p[1] == m[2]); }

/* ---------- jalankan ---------- */
const gen = BANK.filter(q => q.generated || q.id === "TIU-FIG-001");
gen.forEach(q => {
  try {
    if (q.subtopik === "Numerik – Berhitung") { const v = hitungEkspresi(q.pertanyaan), k = angka(kunciTeks(q)); if (!Number.isFinite(v)) catat("manual", q, "ekspresi tidak terurai"); else if (!dekat(v, k, 1e-6)) catat("salah", q, "hitung ulang = " + v + ", kunci = " + k); else catat("ok", q, "hitung"); }
    else if (q.subtopik === "Numerik – Deret") cekDeret(q);
    else if (q.subtopik === "Numerik – Perbandingan Kuantitatif") cekPK(q);
    else if (q.subtopik === "Numerik – Soal Cerita") cekCerita(q);
    else if (q.subtes === "SKB-NALAR") cekNalar(q);
    else if (/^Figural/.test(q.subtopik)) cekFigural(q);
  } catch (e) { catat("manual", q, "galat pemeriksa: " + e.message); }
  // kualitas opsi angka
  const num = q.opsi.map(o => angka(o.teks));
  if (!q.opsi.some(o => /<svg/.test(o.teks)) && num.every(Number.isFinite)) {
    const kv = angka(kunciTeks(q));
    if (kv > 0 && num.some(v => v < 0)) catat("opsi", q, "ada pengecoh negatif padahal jawaban positif");
    if (new Set(num.map(v => Math.round(v * 1e6))).size !== 5) catat("opsi", q, "nilai opsi kembar setelah dibaca sebagai angka");
  }
});
// duplikasi teks (seluruh bank)
const peta = {};
BANK.forEach(q => { const key = q.subtes + "|" + bersih(q.pertanyaan).toLowerCase() + "|" + (q.gambar || "") + "|" + q.opsi.map(o => bersih(o.teks) || o.teks).sort().join("#"); (peta[key] = peta[key] || []).push(q.id); });
Object.values(peta).filter(v => v.length > 1).forEach(ids => hasil.duplikat.push({ id: ids.join(", "), ket: "teks soal identik" }));

const ring = { diperiksa: gen.length, ok: hasil.ok.length, salah: hasil.salah.length, ambigu: hasil.ambigu.length, manual: hasil.manual.length, duplikat: hasil.duplikat.length, opsi: hasil.opsi.length };
console.log(JSON.stringify(ring));
["salah", "ambigu", "duplikat", "opsi"].forEach(k => hasil[k].forEach(r => console.log(k.toUpperCase(), r.id, "—", r.ket)));
module.exports = { hasil, ring };
if (process.argv.includes("--json")) require("fs").writeFileSync(process.argv[process.argv.indexOf("--json") + 1], JSON.stringify({ ring, hasil }, null, 1));
