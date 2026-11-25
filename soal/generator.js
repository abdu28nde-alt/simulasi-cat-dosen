/* =========================================================
   GENERATOR SOAL TIU NUMERIK, TIU FIGURAL (SVG), dan SKB PENALARAN
   - Memakai RNG berbenih sehingga soal (dan ID-nya) selalu sama
     setiap kali aplikasi dimuat. Jawaban dihitung oleh kode,
     jadi tidak ada salah hitung manual.
   ========================================================= */
(function () {
  "use strict";
  var KODE = ["A", "B", "C", "D", "E"];

  var CUR = null; // RNG aktif terakhir (dipakai bila ri/pick dipanggil tanpa argumen r)
  function rng(seed) {
    var a = seed >>> 0;
    return CUR = function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function ri(r, a, b) {
    if (typeof r !== "function") { b = a; a = r; r = CUR; }
    return a + Math.floor(r() * (b - a + 1));
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function shuffle(r, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function rnd(n) { return Math.round(n * 10000) / 10000; }
  function fmt(n, dec) {
    n = rnd(n);
    if (dec != null) return n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return n.toLocaleString("id-ID", { maximumFractionDigits: 3 });
  }
  function pad(n) { return String(n).padStart(3, "0"); }

  /* Susun 5 opsi angka unik (urut naik, gaya CAT), kembalikan {o, a} */
  function opsiAngka(r, ans, kandidat, fmtFn, minVal) {
    fmtFn = fmtFn || function (x) { return fmt(x); };
    minVal = minVal == null ? 0 : minVal;
    var set = [rnd(ans)];
    function ada(c) { return set.some(function (s) { return Math.abs(s - c) < 1e-6 || fmtFn(s) === fmtFn(c); }); }
    kandidat.forEach(function (c) { c = rnd(c); if (set.length < 5 && !ada(c) && c >= minVal && isFinite(c)) set.push(c); });
    var step = Math.max(1, Math.round(Math.abs(ans) * 0.06)), k = 1;
    while (set.length < 5) {
      var c = rnd(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step);
      if (!ada(c) && c >= minVal) set.push(c);
      k++;
    }
    set.sort(function (x, y) { return x - y; });
    var idx = set.findIndex(function (s) { return Math.abs(s - rnd(ans)) < 1e-6; });
    return { o: set.map(fmtFn), a: KODE[idx] };
  }
  /* Opsi teks: jawaban + pengecoh (unik), diacak berbenih */
  function opsiTeks(r, benar, pengecoh) {
    var list = [benar];
    pengecoh.forEach(function (p) { if (list.length < 5 && list.indexOf(p) < 0) list.push(p); });
    if (list.length < 5) throw new Error("pengecoh kurang");
    var acak = shuffle(r, list);
    return { o: acak, a: KODE[acak.indexOf(benar)] };
  }

  function serupa(fn, seed, asli) { var t; for (var k = 0; k < 12; k++) { t = fn(rng(seed + k * 977)); if (t.q !== asli) return t; } return t; }
  var SEEN = {};
  /* Ambil soal yang belum pernah dibuat (cegah soal kembar). Percobaan pertama memakai benih lama sehingga ID soal yang sudah unik tidak berubah. */
  function unik(fn, seed, sig) { for (var k = 0; k < 60; k++) { var rr = rng(seed + k * 100003), tt = fn(rr), s = sig(tt); if (!SEEN[s]) { SEEN[s] = 1; return { r: rr, t: tt }; } } throw new Error("generator: tidak dapat membuat soal unik untuk benih " + seed); }
  var sigQ = function (t) { return t.q; }, sigFig = function (t) { return (t.g || "") + "|" + (t.op ? t.op.o : t.o).slice().sort().join("#"); };
  var out = { TIU: [], "SKB-NALAR": [] };
  function push(sub, obj) { obj.gen = true; out[sub].push(obj); }

  /* ======================= TIU — BERHITUNG ======================= */
  var hitT = [
    function (r) { // persen + desimal
      var p = pick(r, [10, 20, 25, 40, 50, 75]), a = 20 * ri(5, 40), f = pick(r, [0.25, 0.5, 0.75, 1.5]), b = 4 * ri(5, 30);
      var x = p * a / 100, y = f * b, ans = x + y;
      return { k: "mudah", q: p + "% × " + fmt(a) + " + " + fmt(f) + " × " + b + " = …", ans: ans, c: [x - y, ans + 10, ans - 10, x + b],
        l: [p + "% × " + fmt(a) + " = " + fmt(x), fmt(f) + " × " + b + " = " + fmt(y), fmt(x) + " + " + fmt(y) + " = " + fmt(ans)],
        cc: "Ubah persen/desimal ke pecahan sederhana: 25% = ¼, 50% = ½, 75% = ¾, 0,25 = ¼, 1,5 = 3/2. Hitung dengan membagi dulu, baru mengali." };
    },
    function (r) { // pecahan dari pecahan
      var fr = pick(r, [[3, 4, 2, 5], [2, 3, 3, 5], [5, 6, 3, 4], [3, 8, 2, 3], [4, 5, 5, 8], [2, 7, 7, 10]]);
      var den = fr[1] * fr[3], N = den * ri(2, 12), ans = fr[0] / fr[1] * fr[2] / fr[3] * N;
      return { k: "sedang", q: fr[0] + "/" + fr[1] + " dari " + fr[2] + "/" + fr[3] + " dari " + fmt(N) + " adalah …", ans: ans,
        c: [fr[0] / fr[1] * N, fr[2] / fr[3] * N, ans * 2, ans + fr[1]],
        l: [fr[2] + "/" + fr[3] + " × " + fmt(N) + " = " + fmt(fr[2] / fr[3] * N), fr[0] + "/" + fr[1] + " × " + fmt(fr[2] / fr[3] * N) + " = " + fmt(ans)],
        cc: "Kalikan pecahannya dulu: " + fr[0] + "/" + fr[1] + " × " + fr[2] + "/" + fr[3] + " = " + (fr[0] * fr[2]) + "/" + den + ", lalu " + fmt(N) + " : " + den + " × " + (fr[0] * fr[2]) + " = " + fmt(ans) + "." };
    },
    function (r) { // akar & pangkat
      var x = ri(11, 25), y = ri(2, 6), z = ri(10, 60), ans = x + y * y * y - z;
      return { k: "sedang", q: "√" + (x * x) + " + " + y + "³ − " + z + " = …", ans: ans, c: [ans + 2 * z, x + 3 * y - z, ans + 10, ans - 6],
        l: ["√" + (x * x) + " = " + x, y + "³ = " + (y * y * y), x + " + " + (y * y * y) + " − " + z + " = " + ans],
        cc: "Hafalkan kuadrat 11–25 dan pangkat tiga 2–6 (8, 27, 64, 125, 216). Satuan √" + (x * x) + " berakhiran " + ((x * x) % 10) + " membantu menebak akarnya.", min: ans >= 0 ? 0 : -9999 };
    },
    function (r) { // operasi campuran (urutan operasi)
      var a = ri(12, 30), b = ri(3, 9), d = ri(3, 9), c = d * ri(4, 15), e = ri(5, 40);
      var ans = a * b - c / d + e, salah = (a * b - c) / d + e;
      return { k: "sedang", q: a + " × " + b + " − " + c + " : " + d + " + " + e + " = …", ans: ans, c: [salah, a * b - c / (d + e), ans - 2 * e, ans + d],
        l: ["Kerjakan × dan : lebih dulu dari kiri ke kanan.", a + " × " + b + " = " + (a * b) + "; " + c + " : " + d + " = " + (c / d), (a * b) + " − " + (c / d) + " + " + e + " = " + ans],
        cc: "Ingat KaBaTaKu: kali dan bagi setara (kerjakan dari kiri), tambah dan kurang setara. Pengecoh biasanya hasil menghitung berurutan dari kiri tanpa aturan." };
    },
    function (r) { // persen terbalik
      var p = pick(r, [15, 20, 25, 30, 35, 40, 45, 60, 75]), N = 20 * ri(4, 30), v = N * p / 100;
      return { k: "mudah", q: "Jika " + p + "% dari suatu bilangan adalah " + fmt(v) + ", bilangan tersebut adalah …", ans: N,
        c: [v * p / 100, v + p, N / 2, N + 20],
        l: [p + "% × n = " + fmt(v), "n = " + fmt(v) + " × 100/" + p + " = " + fmt(N)],
        cc: "Cari 1% lebih dulu: " + fmt(v) + " : " + p + " = " + fmt(v / p) + ", lalu kalikan 100." };
    },
    function (r) { // sifat pangkat
      var a = pick(r, [2, 3]), b = pick(r, [3, 5]), m = ri(4, 7), p = ri(1, m - 1), n = ri(2, 4), qq = ri(1, n - 1);
      var ans = Math.pow(a, m - p) * Math.pow(b, n - qq);
      return { k: "sulit", q: "(" + a + "<sup>" + m + "</sup> × " + b + "<sup>" + n + "</sup>) : (" + a + "<sup>" + p + "</sup> × " + b + "<sup>" + qq + "</sup>) = …", ans: ans,
        c: [Math.pow(a, m + p) * Math.pow(b, n - qq), Math.pow(a, m - p) * Math.pow(b, n + qq), ans * a, ans / b],
        l: ["Gunakan aⁿ : aᵐ = aⁿ⁻ᵐ untuk tiap basis.", a + "<sup>" + m + "−" + p + "</sup> = " + Math.pow(a, m - p) + "; " + b + "<sup>" + n + "−" + qq + "</sup> = " + Math.pow(b, n - qq), "Hasil = " + Math.pow(a, m - p) + " × " + Math.pow(b, n - qq) + " = " + fmt(ans)],
        cc: "Jangan hitung pangkat penuh. Kurangkan eksponen basis yang sama dulu, baru kalikan sisanya." };
    }
  ];
  for (var i = 0; i < 18; i++) {
    var u = unik(hitT[i % hitT.length], 1000 + i, sigQ), r = u.r, t = u.t, op = opsiAngka(r, t.ans, t.c, null, t.min);
    var t2 = serupa(hitT[i % hitT.length], 5000 + i, t.q);
    push("TIU", { id: "TIU-GEN-HIT-" + pad(i + 1), t: "Numerik – Berhitung", k: t.k, q: t.q, o: op.o, a: op.a,
      p: { k: "Operasi hitung dasar: urutan operasi, pecahan, persen, akar, dan pangkat.", l: t.l, c: t.cc,
        x: { lain: "Opsi lain adalah hasil kesalahan umum (urutan operasi terbalik, salah konversi persen/pecahan, atau salah tanda)." },
        s: [t2.q, "Jawaban: " + fmt(t2.ans)] } });
  }

  /* ======================= TIU — DERET ======================= */
  var ALFA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var derT = [
    function (r) { var a = ri(3, 30), d = ri(3, 12), s = [0, 1, 2, 3, 4].map(function (k) { return a + k * d; });
      return { k: "mudah", s: s, ans: a + 5 * d, pola: "Aritmetika: selalu +" + d + ".", cc: "Selisih tetap " + d + " → suku berikutnya " + s[4] + " + " + d + "." }; },
    function (r) { var a = ri(2, 6), q = pick(r, [2, 3]), s = [0, 1, 2, 3, 4].map(function (k) { return a * Math.pow(q, k); });
      return { k: "mudah", s: s, ans: a * Math.pow(q, 5), pola: "Geometri: selalu ×" + q + ".", cc: "Bagi suku dengan suku sebelumnya; hasil tetap " + q + "." }; },
    function (r) { var a = ri(2, 5), m = pick(r, [2, 3]), c = pick(r, [-1, 1, 2, 3]), s = [a];
      for (var k = 1; k < 5; k++) s.push(s[k - 1] * m + c);
      return { k: "sedang", s: s, ans: s[4] * m + c, pola: "Pola ×" + m + (c >= 0 ? " + " + c : " − " + (-c)) + ".",
        cc: "Jika selisih tumbuh cepat, coba ×2 atau ×3 lalu cek sisa tambah/kurangnya." }; },
    function (r) { var a = ri(2, 20), d = ri(2, 6), st = ri(1, 4), s = [a], df = d;
      for (var k = 1; k < 5; k++) { s.push(s[k - 1] + df); df += st; }
      return { k: "sedang", s: s, ans: s[4] + df, pola: "Bertingkat: selisihnya " + [d, d + st, d + 2 * st, d + 3 * st].join(", ") + " (naik " + st + "), selisih berikutnya " + df + ".",
        cc: "Tulis selisih tingkat pertama; jika belum tetap, cari selisih tingkat kedua." }; },
    function (r) { var a = ri(2, 15), d1 = ri(2, 7), b = ri(20, 60), d2 = -ri(2, 6), s = [];
      for (var k = 0; k < 7; k++) s.push(k % 2 === 0 ? a + (k / 2) * d1 : b + ((k - 1) / 2) * d2);
      return { k: "sulit", s: s, ans: b + 3 * d2, pola: "Selang-seling: suku ganjil +" + d1 + " (" + [s[0], s[2], s[4], s[6]].join(", ") + "), suku genap " + d2 + " (" + [s[1], s[3], s[5]].join(", ") + "). Suku ke-8 mengikuti pola genap.",
        cc: "Jika naik-turun tidak teratur, pisahkan suku ganjil dan genap." }; },
    function (r) { var st = ri(2, 4), a = ri(0, 22 - 5 * st), s = [0, 1, 2, 3, 4].map(function (k) { return a + k * st; });
      return { k: "sedang", huruf: true, s: s, ans: a + 5 * st, pola: "Huruf melompat +" + st + " posisi (" + s.map(function (x) { return ALFA[x] + "=" + (x + 1); }).join(", ") + ").",
        cc: "Ubah huruf menjadi angka urutan (A=1 … Z=26), kerjakan seperti deret angka, lalu kembalikan ke huruf." }; },
    function (r) { var a = ri(1, 5), b = ri(2, 7), s = [a, b];
      for (var k = 2; k < 6; k++) s.push(s[k - 1] + s[k - 2]);
      return { k: "sulit", s: s, ans: s[4] + s[5], pola: "Setiap suku = jumlah dua suku sebelumnya (pola Fibonacci).", cc: "Jika selisihnya sama dengan suku-suku awal, curigai pola penjumlahan dua suku." }; }
  ];
  for (i = 0; i < 18; i++) {
    u = unik(derT[i % derT.length], 2000 + i, function (x) { return x.s.join(","); }); r = u.r; t = u.t;
    var q, o;
    if (t.huruf) {
      var benar = ALFA[t.ans], pg = [t.ans + 1, t.ans - 1, t.ans + 2, t.ans - 2, t.ans + 3].filter(function (x) { return x >= 0 && x < 26; }).map(function (x) { return ALFA[x]; });
      o = opsiTeks(r, benar, pg);
      q = t.s.map(function (x) { return ALFA[x]; }).join(", ") + ", …";
    } else {
      o = opsiAngka(r, t.ans, [t.ans + 1, t.ans - 2, t.ans + (t.s[4] - t.s[3]), t.ans * 2 - t.s[4] + 3], null, -9999);
      q = t.s.join(", ") + ", …";
    }
    var tr = derT[i % derT.length](rng(6000 + i));
    push("TIU", { id: "TIU-GEN-DER-" + pad(i + 1), t: "Numerik – Deret", k: t.k, q: "Suku berikutnya dari deret " + q + " adalah …", o: o.o, a: o.a,
      p: { k: "Cari pola: selisih tetap (aritmetika), rasio tetap (geometri), selisih bertingkat, selang-seling, atau penjumlahan dua suku.",
        l: [t.pola, "Suku berikutnya = " + (t.huruf ? ALFA[t.ans] : fmt(t.ans)) + "."], c: t.cc,
        x: { lain: "Opsi lain muncul jika pola hanya dicek pada dua suku pertama atau salah menentukan selisih berikutnya." },
        s: ["Suku berikutnya: " + (tr.huruf ? tr.s.map(function (x) { return ALFA[x]; }).join(", ") : tr.s.join(", ")) + ", …", "Jawaban: " + (tr.huruf ? ALFA[tr.ans] : tr.ans)] } });
  }

  /* ============== TIU — PERBANDINGAN KUANTITATIF ============== */
  var PK_OPSI = ["x > y", "x < y", "x = y", "Hubungan x dan y tidak dapat ditentukan", "2x = y"];
  var pkT = [
    function (r) { var f = pick(r, [[3, 8], [5, 8], [2, 7], [4, 9], [5, 12], [7, 16], [3, 7], [5, 6]]), x = f[0] / f[1], y = Math.round(x * 100 + pick(r, [-3, -2, 2, 3])) / 100;
      return { k: "mudah", q: "x = " + f[0] + "/" + f[1] + "<br>y = " + fmt(y, 2), x: x, y: y, l: ["x = " + f[0] + "/" + f[1] + " ≈ " + fmt(x, 3), "y = " + fmt(y, 2)], cc: "Ubah pecahan ke desimal tiga angka atau samakan penyebut dengan y." }; },
    function (r) { var p = 5 * ri(3, 18), qn = 10 * ri(2, 12), same = r() < 0.5, p2 = same ? qn : qn + pick(r, [-10, 10]);
      var x = p * qn / 100, y = p2 * p / 100;
      return { k: "sedang", q: "x = " + p + "% dari " + qn + "<br>y = " + p2 + "% dari " + p, x: x, y: y, l: ["x = " + p + " × " + qn + " : 100 = " + fmt(x), "y = " + p2 + " × " + p + " : 100 = " + fmt(y)], cc: "a% dari b = b% dari a. Jika angka hanya bertukar tempat, hasilnya pasti sama." }; },
    function (r) { var n = ri(20, 200), m = Math.round(Math.sqrt(n)) + pick(r, [-1, 0, 1]);
      if (m * m === n) n += 1;
      return { k: "sedang", q: "x = √" + n + "<br>y = " + m, x: Math.sqrt(n), y: m, l: ["Bandingkan kuadratnya: x² = " + n + ", y² = " + (m * m) + "."], cc: "Untuk bilangan positif, membandingkan akar sama dengan membandingkan kuadratnya." }; },
    function (r) { var sol = ri(2, 12), a = ri(2, 6), b = ri(1, 20), c = a * sol + b, y = sol + pick(r, [-1, 0, 1]);
      return { k: "mudah", q: a + "x + " + b + " = " + c + "<br>y = " + y, x: sol, y: y, l: [a + "x = " + c + " − " + b + " = " + (c - b), "x = " + sol], cc: "Selesaikan persamaan linear lebih dulu, baru bandingkan." }; },
    function (r) { var s = ri(5, 15), pp = ri(s - 3, s + 4), ll = 2 * s - pp + pick(r, [-1, 0, 1]);
      if (ll < 2) ll = 2;
      return { k: "sedang", q: "x = keliling persegi dengan sisi " + s + " cm<br>y = keliling persegi panjang " + pp + " cm × " + ll + " cm", x: 4 * s, y: 2 * (pp + ll), l: ["x = 4 × " + s + " = " + (4 * s), "y = 2 × (" + pp + " + " + ll + ") = " + (2 * (pp + ll))], cc: "Cukup bandingkan 2s dengan p + l." }; },
    function (r) { var a = ri(2, 5), b = ri(2, 4), x = Math.pow(a, b + 1), y = Math.pow(a + 1, b);
      return { k: "sulit", q: "x = " + a + "<sup>" + (b + 1) + "</sup><br>y = " + (a + 1) + "<sup>" + b + "</sup>", x: x, y: y, l: ["x = " + x, "y = " + y], cc: "Hitung langsung bila angkanya kecil; jangan menebak dari besar basis saja." }; }
  ];
  var pkCount = 0, seed = 3000;
  while (pkCount < 14) {
    r = rng(seed++); t = pkT[pkCount % pkT.length](r);
    if (Math.abs(2 * t.x - t.y) < 1e-9) continue;
    var rel = Math.abs(t.x - t.y) < 1e-9 ? 2 : t.x > t.y ? 0 : 1;
    push("TIU", { id: "TIU-GEN-PK-" + pad(pkCount + 1), t: "Numerik – Perbandingan Kuantitatif", k: t.k, q: "Diketahui:<br>" + t.q + "<br>Hubungan yang benar antara x dan y adalah …", o: PK_OPSI.slice(), a: KODE[rel],
      p: { k: "Hitung atau sederhanakan x dan y ke bentuk yang sama, lalu bandingkan.", l: t.l.concat(["Jadi " + PK_OPSI[rel] + "."]), c: t.cc,
        x: { D: "Selalu dapat ditentukan karena x dan y bernilai pasti.", E: "2x = y tidak terpenuhi pada nilai ini." } } });
    pkCount++;
  }

  /* ======================= TIU — SOAL CERITA ======================= */
  var KERJA = [[12, 6], [10, 15], [20, 30], [6, 3], [12, 24], [18, 9], [21, 42], [28, 21], [36, 12], [40, 10], [15, 30], [24, 8]];
  var cerT = [
    function (r) { var pr = pick(r, KERJA), ctx = pick(r, ["memeriksa lembar jawaban ujian", "menginput data nilai mahasiswa", "menyusun dokumen akreditasi", "memindai arsip skripsi"]), ans = pr[0] * pr[1] / (pr[0] + pr[1]);
      return { k: "sedang", q: "Staf A dapat " + ctx + " dalam " + pr[0] + " hari, sedangkan staf B dalam " + pr[1] + " hari. Jika bekerja bersama, pekerjaan selesai dalam … hari.", ans: ans,
        c: [(pr[0] + pr[1]) / 2, Math.abs(pr[0] - pr[1]), ans + 2, ans - 1], l: ["Kecepatan A = 1/" + pr[0] + ", B = 1/" + pr[1] + " per hari.", "Bersama = 1/" + pr[0] + " + 1/" + pr[1] + " = 1/" + ans + " → " + ans + " hari."], cc: "Rumus cepat: (a × b) : (a + b) = " + (pr[0] * pr[1]) + " : " + (pr[0] + pr[1]) + " = " + ans + "." }; },
    function (r) { var pr = pick(r, [[60, 40], [30, 60], [60, 90], [45, 90], [40, 60], [20, 30]]), ans = 2 * pr[0] * pr[1] / (pr[0] + pr[1]);
      return { k: "sulit", q: "Seorang dosen berkendara ke kampus cabang dengan kecepatan rata-rata " + pr[0] + " km/jam dan kembali melalui jalan yang sama dengan " + pr[1] + " km/jam. Kecepatan rata-rata pulang-pergi adalah … km/jam.", ans: ans,
        c: [(pr[0] + pr[1]) / 2, ans + 4, ans - 3, Math.max(pr[0], pr[1]) - 5], l: ["Misal jarak = d. Waktu total = d/" + pr[0] + " + d/" + pr[1] + ".", "Rata-rata = 2d : waktu total = 2 × " + pr[0] + " × " + pr[1] + " : (" + pr[0] + " + " + pr[1] + ") = " + ans + "."],
        cc: "Kecepatan rata-rata pulang-pergi bukan rata-rata biasa. Pakai 2ab : (a + b). Rata-rata biasa (" + ((pr[0] + pr[1]) / 2) + ") adalah pengecoh." }; },
    function (r) { var beli = 50000 * ri(2, 20), p = pick(r, [10, 15, 20, 25, 30, 40]), jual = beli * (100 + p) / 100;
      return { k: "mudah", q: "Koperasi kampus membeli sebuah printer seharga Rp" + fmt(beli) + " dan menjualnya dengan keuntungan " + p + "%. Harga jualnya adalah Rp…", ans: jual,
        c: [beli * p / 100, beli * (100 - p) / 100, jual + 50000, beli + p * 1000], l: ["Untung = " + p + "% × " + fmt(beli) + " = " + fmt(beli * p / 100), "Harga jual = " + fmt(beli) + " + " + fmt(beli * p / 100) + " = " + fmt(jual)], cc: "Langsung kalikan dengan (100 + " + p + ")% = " + fmt((100 + p) / 100) + "." }; },
    function (r) { var beli, p, jual; do { p = pick(r, [20, 25, 40, 50, 60]); beli = 10000 * ri(10, 60); jual = beli * (100 + p) / 100; } while (jual % 1000);
      return { k: "sulit", q: "Sebuah buku referensi dijual Rp" + fmt(jual) + " dengan keuntungan " + p + "% dari harga beli. Harga beli buku tersebut adalah Rp…", ans: beli,
        c: [jual * (100 - p) / 100, jual - p * 1000, beli + 10000, beli - 10000], l: ["Harga jual = (100 + " + p + ")% × harga beli", "Harga beli = " + fmt(jual) + " × 100/" + (100 + p) + " = " + fmt(beli)],
        cc: "Jangan mengurangi " + p + "% dari harga jual — itu pengecoh. Bagi dengan " + fmt((100 + p) / 100) + "." }; },
    function (r) { var n1, n2, m1, m2, M; do { n1 = ri(10, 40); n2 = ri(10, 40); m1 = ri(60, 85); m2 = ri(60, 90); M = (n1 * m1 + n2 * m2) / (n1 + n2); } while (M % 1 || m1 === m2);
      return { k: "sedang", q: "Rata-rata nilai " + n1 + " mahasiswa kelas A adalah " + m1 + ", sedangkan rata-rata " + n2 + " mahasiswa kelas B adalah " + m2 + ". Rata-rata nilai gabungan kedua kelas adalah …", ans: M,
        c: [(m1 + m2) / 2, M + 2, M - 2, M + 1], l: ["Total A = " + n1 + " × " + m1 + " = " + (n1 * m1) + "; total B = " + n2 + " × " + m2 + " = " + (n2 * m2), "Rata-rata = " + (n1 * m1 + n2 * m2) + " : " + (n1 + n2) + " = " + M],
        cc: "Rata-rata gabungan selalu lebih dekat ke kelompok yang lebih besar; (" + m1 + " + " + m2 + ") : 2 hanya benar jika jumlah anggota sama." }; },
    function (r) { var k, m, tt, B; do { k = ri(3, 5); m = ri(2, k - 1); tt = ri(2, 10); B = (m - 1) * tt / (k - m); } while (B % 1 || B < 2);
      return { k: "sulit", q: "Umur seorang dosen sekarang " + k + " kali umur anaknya. " + tt + " tahun lagi, umur dosen tersebut " + m + " kali umur anaknya. Umur anak sekarang adalah … tahun.", ans: B,
        c: [B + tt, k * B, B + 1, B - 1], l: ["Misal umur anak = a, dosen = " + k + "a.", k + "a + " + tt + " = " + m + "(a + " + tt + ") → " + (k - m) + "a = " + ((m - 1) * tt) + " → a = " + B],
        cc: "Uji opsi: kalikan opsi dengan " + k + ", tambah " + tt + " pada keduanya, lalu cek apakah perbandingannya " + m + " : 1." }; },
    function (r) { var n, rr, r2, x; do { n = ri(3, 6); rr = ri(70, 82); r2 = rr + ri(1, 3); x = (n + 1) * r2 - n * rr; } while (x > 100);
      return { k: "sedang", q: "Rata-rata " + n + " nilai kuis seorang mahasiswa adalah " + rr + ". Agar rata-ratanya menjadi " + r2 + ", nilai kuis berikutnya harus …", ans: x,
        c: [r2, x - (r2 - rr), x + n, 2 * r2 - rr], l: ["Total sekarang = " + n + " × " + rr + " = " + (n * rr), "Total yang dibutuhkan = " + (n + 1) + " × " + r2 + " = " + ((n + 1) * r2), "Nilai berikutnya = " + ((n + 1) * r2) + " − " + (n * rr) + " = " + x],
        cc: "Rata-rata baru + (jumlah data lama × kenaikan) = " + r2 + " + " + n + " × " + (r2 - rr) + " = " + x + "." }; }
  ];
  for (i = 0; i < 21; i++) {
    u = unik(cerT[i % cerT.length], 4000 + i, sigQ); r = u.r; t = u.t;
    op = opsiAngka(r, t.ans, t.c);
    t2 = serupa(cerT[i % cerT.length], 7000 + i, t.q);
    push("TIU", { id: "TIU-GEN-CER-" + pad(i + 1), t: "Numerik – Soal Cerita", k: t.k, q: t.q, o: op.o, a: op.a,
      p: { k: "Terjemahkan cerita ke model matematika (kerja bersama, kecepatan, untung-rugi, rata-rata, umur), lalu hitung.", l: t.l, c: t.cc,
        x: { lain: "Opsi lain adalah hasil memakai rumus yang keliru (mis. rata-rata biasa) atau salah satu langkah." }, s: [t2.q, "Jawaban: " + fmt(t2.ans)] } });
  }

  /* ======================= TIU — FIGURAL (SVG) ======================= */
  var POS8 = [[12, 12], [30, 12], [48, 12], [48, 30], [48, 48], [30, 48], [12, 48], [12, 30]];
  var POSNAMA = ["kiri atas", "tengah atas", "kanan atas", "kanan tengah", "kanan bawah", "tengah bawah", "kiri bawah", "kiri tengah"];
  var FIG = {
    box: function (inner, w) { w = w || 64; return '<svg viewBox="0 0 60 60" width="' + w + '" height="' + w + '" class="fig" role="img" aria-label="gambar"><rect x="2" y="2" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" rx="3"/>' + inner + "</svg>"; },
    tanya: function () { return '<svg viewBox="0 0 60 60" width="64" height="64" class="fig" role="img" aria-label="tanda tanya"><rect x="2" y="2" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" rx="3"/><text x="30" y="40" text-anchor="middle" font-size="26" font-weight="700" fill="currentColor">?</text></svg>'; },
    dot: function (p) { return '<circle cx="' + POS8[p][0] + '" cy="' + POS8[p][1] + '" r="5.5" fill="currentColor"/>'; },
    panah: function (deg) { return '<g transform="rotate(' + deg + ' 30 30)"><line x1="30" y1="48" x2="30" y2="17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><polygon points="30,9 22,20 38,20" fill="currentColor"/></g>'; },
    panahK: function (deg) { return '<g transform="rotate(' + deg + ' 30 30)"><line x1="30" y1="40" x2="30" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><polygon points="30,17 24,26 36,26" fill="currentColor"/></g>'; },
    bendera: function (deg, cermin) {
      var s = '<line x1="30" y1="50" x2="30" y2="14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><polygon points="30,8 23,18 37,18" fill="currentColor"/><polygon points="31,24 44,28 31,33" fill="currentColor"/><circle cx="30" cy="50" r="3" fill="currentColor"/>';
      if (cermin) s = '<g transform="translate(60 0) scale(-1 1)">' + s + "</g>";
      return '<g transform="rotate(' + deg + ' 30 30)">' + s + "</g>";
    },
    poligon: function (n, isi) {
      var pts = [];
      for (var k = 0; k < n; k++) { var a = -Math.PI / 2 + k * 2 * Math.PI / n; pts.push((30 + 15 * Math.cos(a)).toFixed(1) + "," + (26 + 15 * Math.sin(a)).toFixed(1)); }
      var shape = n === 0 ? '<circle cx="30" cy="26" r="14"' : '<polygon points="' + pts.join(" ") + '"';
      return shape + ' fill="' + (isi ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2"/>';
    },
    titik: function (n) { var s = "", gap = n > 1 ? Math.min(8, 46 / (n - 1)) : 0, w = (n - 1) * gap; for (var k = 0; k < n; k++) s += '<circle cx="' + (30 - w / 2 + k * gap).toFixed(1) + '" cy="50" r="2.8" fill="currentColor"/>'; return s; },
    baris: function (figs) { return '<div class="figrow">' + figs.join("") + "</div>"; }
  };
  window.FIG = FIG;
  var NAMA_BANGUN = { 0: "lingkaran", 3: "segitiga", 4: "segi empat", 5: "segi lima", 6: "segi enam", 7: "segi tujuh" };
  function arahNama(d) { d = ((d % 360) + 360) % 360; return { 0: "atas", 45: "kanan atas", 90: "kanan", 135: "kanan bawah", 180: "bawah", 225: "kiri bawah", 270: "kiri", 315: "kiri atas" }[d]; }

  function figOpsi(r, benarKey, keys, render) {
    var o = opsiTeks(r, benarKey, keys);
    return { o: o.o.map(render), a: o.a, keys: o.o };
  }

  // SERIAL
  var serialT = [
    function (r) { // titik pojok 90° (2 langkah pada 8 posisi)
      var start = pick(r, [0, 2, 4, 6]), dir = pick(r, [1, -1]), seq = [0, 1, 2, 3].map(function (k) { return ((start + dir * 2 * k) % 8 + 8) % 8; }), ans = ((start + dir * 8) % 8 + 8) % 8;
      var keys = [0, 2, 4, 6, 1].filter(function (p) { return p !== ans; });
      var op = figOpsi(r, ans, keys, function (p) { return FIG.box(FIG.dot(p), 56); });
      return { k: "sedang", g: FIG.baris(seq.map(function (p) { return FIG.box(FIG.dot(p)); }).concat([FIG.tanya()])), op: op,
        l: ["Titik berpindah " + (dir > 0 ? "searah" : "berlawanan arah") + " jarum jam ke pojok berikutnya (90°) setiap langkah.", "Urutan: " + seq.map(function (p) { return POSNAMA[p]; }).join(" → ") + " → " + POSNAMA[ans] + "."],
        cc: "Rotasi 90° kembali ke posisi awal setiap 4 langkah (modulo 4).", jaw: "titik di " + POSNAMA[ans] };
    },
    function (r) { // panah 45°
      var start = 45 * ri(0, 7), dir = pick(r, [1, -1]), seq = [0, 1, 2, 3].map(function (k) { return start + dir * 45 * k; }), ans = ((start + dir * 180) % 360 + 360) % 360;
      var keys = [ans + 45, ans - 45, ans + 90, ans + 180, ans - 90].map(function (d) { return ((d % 360) + 360) % 360; });
      var op = figOpsi(r, ans, keys, function (d) { return FIG.box(FIG.panah(d), 56); });
      return { k: "sedang", g: FIG.baris(seq.map(function (d) { return FIG.box(FIG.panah(d)); }).concat([FIG.tanya()])), op: op,
        l: ["Panah berputar 45° " + (dir > 0 ? "searah" : "berlawanan arah") + " jarum jam setiap langkah.", "Gambar ke-5 adalah panah yang menunjuk ke " + arahNama(ans) + "."],
        cc: "Rotasi 45° kembali ke awal setiap 8 langkah (modulo 8). Hitung arah dari gambar terakhir, bukan dari gambar pertama.", jaw: "panah menunjuk ke " + arahNama(ans) };
    },
    function (r) { // jumlah titik bertambah, bangun berselang isi
      var n0 = ri(1, 2), stp = pick(r, [1, 2]), bg = pick(r, [3, 4, 0]), seq = [0, 1, 2, 3].map(function (k) { return n0 + k * stp; }), ans = n0 + 4 * stp;
      var keyB = ans + "|" + 0, keys = [(ans) + "|1", (ans - stp) + "|0", (ans + 1) + "|0", (ans - 1) + "|1"];
      function rend(key) { var p = key.split("|"); return FIG.box(FIG.poligon(bg, p[1] === "1") + FIG.titik(+p[0]), 56); }
      var op = figOpsi(r, keyB, keys, rend);
      return { k: "sulit", g: FIG.baris(seq.map(function (n, k) { return FIG.box(FIG.poligon(bg, k % 2 === 1) + FIG.titik(n)); }).concat([FIG.tanya()])), op: op,
        l: ["Ada dua pola: jumlah titik bertambah " + stp + " (" + seq.join(", ") + ", " + ans + ") dan " + NAMA_BANGUN[bg] + " berselang putih–hitam.", "Gambar ke-5 (urutan ganjil) berwarna putih dengan " + ans + " titik."],
        cc: "Pisahkan setiap atribut (jumlah, warna, posisi) dan cari pola masing-masing.", jaw: NAMA_BANGUN[bg] + " putih dengan " + ans + " titik" };
    }
  ];
  for (i = 0; i < 12; i++) {
    u = unik(serialT[i % serialT.length], 8000 + i, sigFig); r = u.r; t = u.t;
    push("TIU", { id: "TIU-GEN-FIGS-" + pad(i + 1), t: "Figural – Serial", k: t.k, q: "Perhatikan rangkaian gambar berikut. Gambar yang tepat untuk menggantikan tanda tanya adalah …", g: t.g, o: t.op.o, a: t.op.a,
      p: { k: "Soal serial menguji kemampuan menemukan perubahan yang berulang (rotasi, perpindahan, jumlah unsur, warna).", l: t.l, c: t.cc,
        x: { lain: "Opsi lain sesuai dengan langkah yang terlewat/berlebih atau arah putaran yang keliru." }, s: ["Jika titik berpindah searah jarum jam 90° dari kiri atas, di mana posisinya setelah 6 langkah?", "6 mod 4 = 2 → kanan bawah."] } });
  }
  // ANALOGI
  var anaT = [
    function (r) { // rotasi 90
      var a = 90 * ri(0, 3), dir = pick(r, [90, -90]), c = (a + pick(r, [90, 180])) % 360, ans = ((c + dir) % 360 + 360) % 360;
      var rend = function (key) { var p = key.split("|"); return FIG.box(FIG.bendera(+p[0], p[1] === "m"), 56); };
      var benar = ans + "|n", keys = [((c - dir) % 360 + 360) % 360 + "|n", (c + 180) % 360 + "|n", c + "|n", ans + "|m"];
      var op = figOpsi(r, benar, keys, rend);
      return { k: "sedang", g: FIG.baris([FIG.box(FIG.bendera(a)), "<span class='figsep'>:</span>", FIG.box(FIG.bendera(((a + dir) % 360 + 360) % 360)), "<span class='figsep'>=</span>", FIG.box(FIG.bendera(c)), "<span class='figsep'>:</span>", FIG.tanya()]), op: op,
        l: ["Gambar pertama diputar 90° " + (dir > 0 ? "searah" : "berlawanan arah") + " jarum jam menjadi gambar kedua.", "Terapkan transformasi yang sama pada gambar ketiga. Perhatikan letak bendera kecil: ia ikut berputar, tidak berpindah sisi."],
        cc: "Ikuti satu ciri yang asimetris (di sini bendera kecil). Opsi yang benderanya berpindah sisi adalah hasil pencerminan, bukan rotasi.", jaw: "gambar ketiga diputar 90° " + (dir > 0 ? "searah" : "berlawanan arah") + " jarum jam" };
    },
    function (r) { // pencerminan
      var a = 90 * ri(0, 3), c = (a + pick(r, [90, 180, 270])) % 360;
      var rend = function (key) { var p = key.split("|"); return FIG.box(FIG.bendera(+p[0], p[1] === "m"), 56); };
      // cermin vertikal pada sumbu tegak: bendera berarah c dicerminkan -> arah (360-c) dengan flag cermin
      var mc = (360 - c) % 360, benar = mc + "|m", keys = [mc + "|n", c + "|n", (c + 180) % 360 + "|m", (mc + 90) % 360 + "|m", (mc + 270) % 360 + "|m", (c + 90) % 360 + "|n", (c + 270) % 360 + "|n"];
      var op = figOpsi(r, benar, keys, rend);
      return { k: "sulit", g: FIG.baris([FIG.box(FIG.bendera(a)), "<span class='figsep'>:</span>", FIG.box(FIG.bendera((360 - a) % 360, true)), "<span class='figsep'>=</span>", FIG.box(FIG.bendera(c)), "<span class='figsep'>:</span>", FIG.tanya()]), op: op,
        l: ["Gambar kedua adalah cerminan gambar pertama terhadap garis tegak (kiri ↔ kanan).", "Cerminkan gambar ketiga dengan cara yang sama: sisi kiri dan kanan bertukar, atas–bawah tetap."],
        cc: "Pada cerminan kiri-kanan, unsur yang menunjuk ke atas/bawah tetap, sedangkan yang di kanan pindah ke kiri.", jaw: "cerminan kiri–kanan dari gambar ketiga" };
    },
    function (r) { // bangun: isi dibalik & titik +1
      var b1 = pick(r, [3, 4, 0]), b2 = pick(r, [5, 6, 3, 4, 0].filter(function (x) { return x !== b1; })), n1 = ri(1, 3), n2 = ri(1, 3), isi1 = r() < 0.5;
      var rend = function (key) { var p = key.split("|"); return FIG.box(FIG.poligon(+p[0], p[1] === "1") + FIG.titik(+p[2]), 56); };
      var isi2 = r() < 0.5, benar = b2 + "|" + (isi2 ? "0" : "1") + "|" + (n2 + 1);
      var keys = [b2 + "|" + (isi2 ? "1" : "0") + "|" + (n2 + 1), b2 + "|" + (isi2 ? "0" : "1") + "|" + n2, b1 + "|" + (isi2 ? "0" : "1") + "|" + (n2 + 1), b2 + "|" + (isi2 ? "0" : "1") + "|" + (n2 + 2)];
      var op = figOpsi(r, benar, keys, rend);
      return { k: "sedang", g: FIG.baris([FIG.box(FIG.poligon(b1, isi1) + FIG.titik(n1)), "<span class='figsep'>:</span>", FIG.box(FIG.poligon(b1, !isi1) + FIG.titik(n1 + 1)), "<span class='figsep'>=</span>", FIG.box(FIG.poligon(b2, isi2) + FIG.titik(n2)), "<span class='figsep'>:</span>", FIG.tanya()]), op: op,
        l: ["Dari gambar 1 ke 2: bangun tetap, warna dibalik (hitam ↔ putih), dan jumlah titik bertambah satu.", "Gambar ketiga " + NAMA_BANGUN[b2] + " " + (isi2 ? "hitam" : "putih") + " dengan " + n2 + " titik → menjadi " + NAMA_BANGUN[b2] + " " + (isi2 ? "putih" : "hitam") + " dengan " + (n2 + 1) + " titik."],
        cc: "Daftar perubahan per atribut (bentuk, warna, jumlah), lalu terapkan semuanya.", jaw: NAMA_BANGUN[b2] + " " + (isi2 ? "putih" : "hitam") + " dengan " + (n2 + 1) + " titik" };
    }
  ];
  for (i = 0; i < 12; i++) {
    u = unik(anaT[i % anaT.length], 9000 + i, sigFig); r = u.r; t = u.t;
    push("TIU", { id: "TIU-GEN-FIGA-" + pad(i + 1), t: "Figural – Analogi", k: t.k, q: "Hubungan gambar pertama dengan gambar kedua sama dengan hubungan gambar ketiga dengan gambar …", g: t.g, o: t.op.o, a: t.op.a,
      p: { k: "Analogi figural: temukan transformasi dari gambar 1 ke gambar 2 (rotasi, cerminan, ubah warna, tambah/kurang unsur), lalu terapkan pada gambar 3.", l: t.l, c: t.cc,
        x: { lain: "Pengecoh memakai rotasi arah berlawanan, rotasi 180°, atau cerminan sebagai ganti rotasi." }, s: ["Jika panah ke atas : panah ke kanan, maka panah ke kiri : …", "Panah ke atas (rotasi 90° searah jarum jam)."] } });
  }
  // KETIDAKSAMAAN
  var ketT = [
    function (r) { // rotasi vs cermin
      var angles = shuffle(r, [0, 90, 180, 270, 45, 135, 225, 315]).slice(0, 5), odd = ri(0, 4);
      var figs = angles.map(function (d, k) { return FIG.box(FIG.bendera(d, k === odd), 56); });
      return { k: "sulit", o: figs, a: KODE[odd], l: ["Empat gambar adalah hasil rotasi dari bentuk yang sama (bendera kecil selalu di sisi kanan tiang bila tiang diputar tegak).", "Gambar " + KODE[odd] + " adalah hasil pencerminan: benderanya berada di sisi kiri tiang."],
        cc: "Putar gambar di kepala sampai ujung tiang menghadap ke atas, lalu lihat sisi benderanya." };
    },
    function (r) { // jumlah titik = jumlah sisi
      var bangun = shuffle(r, [3, 4, 5, 6, 7]), odd = ri(0, 4);
      var figs = bangun.map(function (n, k) { var t = k === odd ? n + pick(r, [1, -1]) : n; return FIG.box(FIG.poligon(n, false) + FIG.titik(t), 56); });
      return { k: "sedang", o: figs, a: KODE[odd], l: ["Pada empat gambar, jumlah titik sama dengan jumlah sisi bangunnya.", "Gambar " + KODE[odd] + " (" + NAMA_BANGUN[bangun[odd]] + ") jumlah titiknya tidak sama dengan jumlah sisinya."],
        cc: "Cari hubungan antarunsur dalam satu gambar (sisi ↔ titik), bukan hanya bentuk luarnya." };
    },
    function (r) { // arah panah vs posisi titik
      var p = shuffle(r, [0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 5), odd = ri(0, 4), ARAH = [315, 0, 45, 90, 135, 180, 225, 270];
      var figs = p.map(function (pos, k) { var d = k === odd ? (ARAH[pos] + 180) % 360 : ARAH[pos]; return FIG.box(FIG.panahK(d) + FIG.dot(pos), 56); });
      return { k: "sedang", o: figs, a: KODE[odd], l: ["Pada empat gambar, panah menunjuk ke arah titik hitam.", "Pada gambar " + KODE[odd] + ", panah justru menjauhi titik."],
        cc: "Hubungkan dua unsur dalam gambar: ke mana panah menunjuk dan di mana titik berada." };
    }
  ];
  for (i = 0; i < 12; i++) {
    u = unik(ketT[i % ketT.length], 9500 + i, sigFig); r = u.r; t = u.t;
    push("TIU", { id: "TIU-GEN-FIGK-" + pad(i + 1), t: "Figural – Ketidaksamaan", k: t.k, q: "Gambar yang berbeda dari gambar lainnya adalah …", o: t.o, a: t.a,
      p: { k: "Ketidaksamaan figural: empat gambar memiliki aturan yang sama, satu gambar melanggarnya.", l: t.l, c: t.cc, x: { lain: "Empat opsi lainnya mengikuti aturan yang sama." },
        s: ["Empat segitiga berisi 3 titik dan satu segi empat berisi 3 titik. Mana yang berbeda bila aturannya ‘titik = sisi’?", "Segi empat (seharusnya 4 titik)."] } });
  }
  /* Contoh soal figural dari spesifikasi (TIU-FIG-001) */
  (function () {
    var seq = [0, 2, 4, 6];
    push("TIU", { id: "TIU-FIG-001", t: "Figural – Serial", k: "sedang", gen: false,
      q: "Empat kotak berurutan berisi persegi dengan satu titik hitam di pojok. Gambar kelima adalah …",
      g: FIG.baris(seq.map(function (p) { return FIG.box(FIG.dot(p)); }).concat([FIG.tanya()])),
      o: [FIG.box(FIG.dot(0), 56), FIG.box(FIG.dot(2), 56), FIG.box(FIG.dot(4), 56), FIG.box(FIG.dot(6), 56), FIG.box(FIG.dot(1), 56)], a: "A",
      p: { k: "Pola rotasi: titik berpindah searah jarum jam sebesar 90° setiap langkah.", l: ["Kiri atas → kanan atas → kanan bawah → kiri bawah.", "Langkah kelima kembali ke kiri atas."],
        c: "Untuk pola rotasi, hitung langkah modulo 4 (untuk 90°) atau modulo 8 (untuk 45°).",
        x: { B: "Kanan atas adalah posisi langkah ke-2.", C: "Kanan bawah adalah posisi langkah ke-3.", D: "Kiri bawah adalah posisi langkah ke-4 (sudah ada).", E: "Tengah atas berarti bergeser 45°, tidak sesuai pola 90°." },
        s: ["Jika pola yang sama berlanjut, di mana titik pada gambar ke-7?", "7 mod 4 = 3 → kanan bawah."] } });
  })();

  /* ======================= SKB — PENALARAN (DATA) ======================= */
  var PRODI = ["Matematika", "Biologi", "Kimia", "Fisika", "Statistika", "Informatika", "Farmasi", "Agribisnis", "Manajemen", "Akuntansi", "Hukum", "Psikologi"];
  function tabel(head, rows) {
    return '<table class="tbl"><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (rw) { return "<tr>" + rw.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
  }
  var nalT = [
    function (r) { // persentase kelulusan tertinggi
      var nm, data, pct, best, bestN;
      do {
        nm = shuffle(r, PRODI).slice(0, 4);
        data = nm.map(function () { var n = 5 * ri(6, 24); return [n, Math.round(n * (0.55 + r() * 0.4))]; });
        pct = data.map(function (d) { return d[1] / d[0]; });
        best = pct.indexOf(Math.max.apply(null, pct));
        bestN = data.map(function (d) { return d[1]; }).indexOf(Math.max.apply(null, data.map(function (d) { return d[1]; })));
      } while (pct.filter(function (p) { return Math.abs(p - pct[best]) < 0.005; }).length > 1 || best === bestN);
      var o = opsiTeks(r, nm[best], nm.concat(["Semua prodi sama"]).filter(function (x) { return x !== nm[best]; }));
      return { k: "sedang", q: "Data kelulusan tepat waktu empat program studi:" + tabel(["Prodi", "Mahasiswa", "Lulus tepat waktu"], nm.map(function (n, k) { return [n, data[k][0], data[k][1]]; })) + "Program studi dengan <b>persentase</b> kelulusan tepat waktu tertinggi adalah …", o: o.o, a: o.a,
        l: nm.map(function (n, k) { return n + ": " + data[k][1] + "/" + data[k][0] + " = " + fmt(pct[k] * 100, 1) + "%"; }).concat(["Tertinggi: " + nm[best] + ". Perhatikan bahwa jumlah lulusan terbanyak (" + nm[bestN] + ") bukan persentase tertinggi."]),
        cc: "Jangan terkecoh jumlah mutlak. Bandingkan proporsi; perkiraan cepat dengan membulatkan ke persen terdekat sudah cukup." };
    },
    function (r) { // persentase perubahan
      var base = 20 * ri(10, 40), p = pick(r, [5, 10, 15, 20, 25, 30, 40]) * pick(r, [1, 1, -1]), nw = base * (100 + p) / 100, y = ri(2021, 2024);
      var op = opsiAngka(r, Math.abs(p), [Math.abs(p) + 5, Math.abs(p) - 5, Math.abs(nw - base) / nw * 100, Math.abs(p) * 2], function (x) { return fmt(x, 1) + "%"; });
      return { k: "mudah", q: "Jumlah pendaftar program magister pada tahun " + y + " sebanyak " + fmt(base) + " orang dan pada tahun " + (y + 1) + " sebanyak " + fmt(nw) + " orang. Persentase " + (p > 0 ? "kenaikan" : "penurunan") + " jumlah pendaftar adalah …", o: op.o, a: op.a,
        l: ["Selisih = " + fmt(Math.abs(nw - base)), "Persentase = selisih : nilai awal × 100% = " + fmt(Math.abs(nw - base)) + " : " + fmt(base) + " × 100% = " + Math.abs(p) + "%"],
        cc: "Persentase perubahan selalu dibagi nilai AWAL, bukan nilai akhir." };
    },
    function (r) { // rata-rata IPK gabungan
      var n1 = ri(2, 8) * 5, n2 = ri(2, 6) * 5, m1 = ri(28, 35) / 10, m2 = ri(30, 38) / 10, M = (n1 * m1 + n2 * m2) / (n1 + n2);
      var op = opsiAngka(r, Math.round(M * 100) / 100, [(m1 + m2) / 2, M + 0.1, M - 0.08, M + 0.15].map(function (x) { return Math.round(x * 100) / 100; }), function (x) { return fmt(x, 2); });
      return { k: "sedang", q: "Rata-rata IPK " + n1 + " mahasiswa kelas reguler adalah " + fmt(m1, 2) + ", sedangkan " + n2 + " mahasiswa kelas internasional " + fmt(m2, 2) + ". Rata-rata IPK gabungan (dibulatkan dua desimal) adalah …", o: op.o, a: op.a,
        l: ["Total = " + n1 + " × " + fmt(m1, 2) + " + " + n2 + " × " + fmt(m2, 2) + " = " + fmt(n1 * m1 + n2 * m2, 2), "Rata-rata = " + fmt(n1 * m1 + n2 * m2, 2) + " : " + (n1 + n2) + " ≈ " + fmt(M, 2)],
        cc: "Rata-rata berbobot: kelompok yang lebih besar lebih memengaruhi hasil." };
    },
    function (r) { // rasio dosen
      var d = ri(8, 20), rasio = ri(33, 45), m = d * rasio, target = pick(r, [25, 30]), need = Math.ceil(m / target) - d;
      if (need <= 0) need = 1;
      var op = opsiAngka(r, need, [Math.floor(m / target) - d, need + 2, Math.ceil(m / target), need + 1], null, 0);
      return { k: "sulit", q: "Sebuah prodi memiliki " + d + " dosen tetap dan " + m + " mahasiswa aktif. Agar rasio dosen : mahasiswa paling tinggi 1 : " + target + ", prodi perlu menambah paling sedikit … dosen.", o: op.o, a: op.a,
        l: ["Dosen yang dibutuhkan = " + m + " : " + target + " = " + fmt(m / target, 2) + " → dibulatkan ke atas menjadi " + Math.ceil(m / target) + ".", "Tambahan = " + Math.ceil(m / target) + " − " + d + " = " + need + "."],
        cc: "Kebutuhan minimal orang/ruang selalu dibulatkan ke ATAS." };
    },
    function (r) { // kebutuhan ruang
      var n = ri(130, 420), k = pick(r, [30, 35, 40, 45]), ans = Math.ceil(n / k);
      if (n % k === 0) n += 7, ans = Math.ceil(n / k);
      var op = opsiAngka(r, ans, [Math.floor(n / k), ans + 1, ans + 2, ans - 2], null, 1);
      return { k: "mudah", q: "Ujian akhir diikuti " + n + " mahasiswa. Setiap ruang berkapasitas " + k + " kursi. Jumlah ruang minimal yang harus disiapkan adalah …", o: op.o, a: op.a,
        l: [n + " : " + k + " = " + fmt(n / k, 2), "Sisa mahasiswa tetap butuh ruang → dibulatkan ke atas: " + ans + " ruang."], cc: "Hasil bagi bersisa → +1 ruang." };
    },
    function (r) { // anggaran maks peserta
      var c = pick(r, [1.2, 1.5, 1.6, 2, 2.5]), F = pick(r, [2, 3, 4, 5]), n = ri(8, 25), B = Math.round((F + c * n + c * pick(r, [0.3, 0.5, 0.7])) * 10) / 10, ans = Math.floor((B - F) / c + 1e-9);
      var op = opsiAngka(r, ans, [Math.floor(B / c), ans + 1, ans - 1, Math.ceil((B - F) / c + 0.01)], null, 1);
      return { k: "sedang", q: "Anggaran pelatihan penulisan artikel sebesar Rp" + fmt(B, 1) + " juta. Biaya tetap (narasumber dan ruang) Rp" + F + " juta, sedangkan biaya per peserta Rp" + fmt(c, 1) + " juta. Jumlah peserta maksimum adalah …", o: op.o, a: op.a,
        l: ["Sisa untuk peserta = " + fmt(B, 1) + " − " + F + " = " + fmt(B - F, 1) + " juta", fmt(B - F, 1) + " : " + fmt(c, 1) + " = " + fmt((B - F) / c, 2) + " → dibulatkan ke bawah: " + ans + " peserta"],
        cc: "Kurangi biaya tetap dulu. Jumlah maksimum yang dibiayai selalu dibulatkan ke BAWAH." };
    },
    function (r) { // IP semester
      var mk = shuffle(r, ["Statistika", "Metodologi Penelitian", "Etika Profesi", "Kalkulus", "Bahasa Inggris Akademik"]).slice(0, 3), sks = mk.map(function () { return pick(r, [2, 3, 4]); }), nl = mk.map(function () { return pick(r, [["A", 4], ["B", 3], ["C", 2], ["A", 4]]); });
      var tot = 0, ts = 0; sks.forEach(function (s, k) { tot += s * nl[k][1]; ts += s; });
      var ip = Math.round(tot / ts * 100) / 100, avg = Math.round(nl.reduce(function (a, b) { return a + b[1]; }, 0) / 3 * 100) / 100;
      var op = opsiAngka(r, ip, [avg, ip + 0.15, ip - 0.12, ip + 0.25], function (x) { return fmt(x, 2); });
      return { k: "sedang", q: "Nilai seorang mahasiswa pada semester ini:" + tabel(["Mata kuliah", "SKS", "Nilai"], mk.map(function (m, k) { return [m, sks[k], nl[k][0]]; })) + "Jika A = 4, B = 3, dan C = 2, indeks prestasi semester (dua desimal) adalah …", o: op.o, a: op.a,
        l: ["Mutu = " + sks.map(function (s, k) { return s + " × " + nl[k][1]; }).join(" + ") + " = " + tot, "IP = " + tot + " : " + ts + " SKS = " + fmt(ip, 2)],
        cc: "IP adalah rata-rata berbobot SKS, bukan rata-rata nilai biasa (" + fmt(avg, 2) + ")." };
    }
  ];
  for (i = 0; i < 65; i++) {
    u = unik(nalT[i % nalT.length], 11000 + i, sigQ); r = u.r; t = u.t;
    push("SKB-NALAR", { id: "SKB-GEN-NAL-" + pad(i + 1), t: "Membaca Data", k: t.k, q: t.q, o: t.o, a: t.a,
      p: { k: "Penalaran data akademik: hitung proporsi, perubahan, rata-rata berbobot, atau pembulatan kebutuhan secara tepat sebelum menyimpulkan.", l: t.l, c: t.cc,
        x: { lain: "Opsi lain adalah hasil kesalahan umum: membandingkan jumlah mutlak, membagi dengan nilai akhir, rata-rata tanpa bobot, atau pembulatan ke arah yang salah." } } });
  }

  addSoal("TIU", out.TIU);
  addSoal("SKB-NALAR", out["SKB-NALAR"]);
})();
