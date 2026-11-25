/* =========================================================
   BANK SOAL — inti (helper + validator)
   Semua file soal-*.js memanggil addSoal(subtes, daftar).
   Format ringkas per soal:
   {
     id, t: subtopik, k: kesulitan ("mudah"|"sedang"|"sulit"),
     q: pertanyaan (boleh HTML), g: gambar (HTML/SVG, opsional),
     o: ["A","B","C","D","E"]           -> tipe pilihan, kunci di a
        atau [["teks",skor], ...]        -> tipe skala (TKP/Dimensi Psikologi)
     a: "C"  (kunci, hanya untuk pilihan),
     f: ["kemenag"] (formasi, opsional; default semua formasi),
     v: "2026-11" | "perlu verifikasi" (terakhirDiverifikasi),
     p: { k: konsep, l: [langkah], c: cara cepat, x: {A:"..."} opsi lain,
          s: ["soal serupa","jawaban"], h: dasar hukum }
   }
   ========================================================= */
window.BANK = window.BANK || [];

(function () {
  var KODE = ["A", "B", "C", "D", "E"];
  var SEMUA_FORMASI = ["umum", "kemdiktisaintek", "kemenag"];

  function normalize(subtes, o) {
    var skala = Array.isArray(o.o[0]);
    var opsi = o.o.map(function (x, i) {
      return skala
        ? { kode: KODE[i], teks: x[0], skor: x[1] }
        : { kode: KODE[i], teks: x, skor: KODE[i] === o.a ? 5 : 0 };
    });
    var p = o.p || {};
    return {
      id: o.id,
      subtes: subtes,
      subtopik: o.t,
      formasi: o.f || SEMUA_FORMASI.slice(),
      kesulitan: o.k || "sedang",
      tipe: skala ? "skala" : "pilihan",
      pertanyaan: o.q,
      gambar: o.g || null,
      opsi: opsi,
      pembahasan: {
        konsep: p.k || "",
        langkah: p.l || [],
        caraCepat: p.c || "",
        opsiLain: p.x || {},
        soalSerupa: p.s ? { pertanyaan: p.s[0], jawaban: p.s[1] } : null,
        dasarHukum: p.h || ""
      },
      terakhirDiverifikasi: o.v || "2026-11",
      generated: !!o.gen
    };
  }

  window.addSoal = function (subtes, list) {
    list.forEach(function (o) {
      try { window.BANK.push(normalize(subtes, o)); }
      catch (e) { console.warn("[Bank Soal] Gagal memuat", o && o.id, e); }
    });
  };

  /* Validator otomatis — dipanggil oleh aplikasi saat dimuat */
  window.validasiBank = function (bank) {
    var masalah = [], ids = {};
    bank.forEach(function (q) {
      var id = q.id || "(tanpa id)";
      if (ids[id]) masalah.push(id + ": ID duplikat");
      ids[id] = true;
      if (!q.opsi || q.opsi.length !== 5) masalah.push(id + ": jumlah opsi bukan 5");
      else {
        var kode = q.opsi.map(function (o) { return o.kode; }).join("");
        if (kode !== "ABCDE") masalah.push(id + ": kode opsi harus A–E");
        if (q.tipe === "pilihan") {
          var lima = q.opsi.filter(function (o) { return o.skor === 5; }).length;
          var lain = q.opsi.filter(function (o) { return o.skor !== 5 && o.skor !== 0; }).length;
          if (lima !== 1) masalah.push(id + ": harus tepat satu opsi bernilai 5 (ditemukan " + lima + ")");
          if (lain) masalah.push(id + ": opsi salah harus bernilai 0");
          var teks = q.opsi.map(function (o) { return String(o.teks).replace(/\s+/g, " ").trim(); });
          if (new Set(teks).size !== 5) masalah.push(id + ": ada teks opsi yang kembar");
        } else if (q.tipe === "skala") {
          var s = q.opsi.map(function (o) { return o.skor; }).sort().join("");
          if (s !== "12345") masalah.push(id + ": skor skala harus unik 1–5 (ditemukan " + s + ")");
        } else masalah.push(id + ": tipe tidak dikenal");
      }
      var pb = q.pembahasan || {};
      if (!pb.konsep && !(pb.langkah && pb.langkah.length)) masalah.push(id + ": pembahasan kosong");
      if (!q.pertanyaan) masalah.push(id + ": pertanyaan kosong");
    });
    if (masalah.length) {
      console.warn("[Validator Bank Soal] " + masalah.length + " masalah ditemukan:");
      masalah.forEach(function (m) { console.warn("  • " + m); });
    } else {
      console.info("[Validator Bank Soal] Semua " + bank.length + " soal lolos validasi.");
    }
    return masalah;
  };
})();
