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
     v: "2026-11" | "perlu verifikasi" (status verifikasi isi),
     cek: "2026-11-26" (tanggal terakhir rujukan hukum dicek manusia, opsional),
     p: { k: konsep, l: [langkah], c: cara cepat, x: {A:"..."} opsi lain,
          s: ["soal serupa","jawaban"], h: dasar hukum / rujukan, r: rujukan buku/tokoh/teori }
   }
   ========================================================= */
window.BANK = window.BANK || [];

(function () {
  var KODE = ["A", "B", "C", "D", "E"];
  var SEMUA_FORMASI = ["umum", "kemdiktisaintek", "kemenag", "uinsgd-fdk"];
  var RE_HUKUM = /\b(UUD|Undang-Undang|UU No|Pasal \d|Peraturan Pemerintah|PP No|Perpres|Keppres|Permen\w*|Kepmen\w*|KMA|Perma|Tap MPR|Inpres)\b/;

  function teks(s) { return String(s == null ? "" : s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }

  function normalize(subtes, o) {
    var skala = Array.isArray(o.o[0]);
    var opsi = o.o.map(function (x, i) {
      return skala
        ? { kode: KODE[i], teks: x[0], skor: x[1] }
        : { kode: KODE[i], teks: x, skor: KODE[i] === o.a ? 5 : 0 };
    });
    var p = o.p || {};
    var q = {
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
        dasarHukum: p.h || "",
        rujukan: p.r || ""
      },
      terakhirDiverifikasi: o.v || "2026-11",
      generated: !!o.gen
    };
    /* Fase 1.4 — rujukan hukum */
    q.dasarHukum = q.pembahasan.dasarHukum;
    q.terakhirDicek = o.cek || null;
    var semua = [q.pertanyaan, q.opsi.map(function (x) { return x.teks; }).join(" "), p.k, (p.l || []).join(" "), p.c].map(teks).join(" ");
    q.bermuatanHukum = RE_HUKUM.test(semua) || !!q.dasarHukum;
    q.perluRujukan = q.bermuatanHukum && !q.dasarHukum;
    return q;
  }

  window.addSoal = function (subtes, list) {
    list.forEach(function (o) {
      try { window.BANK.push(normalize(subtes, o)); }
      catch (e) { console.warn("[Bank Soal] Gagal memuat", o && o.id, e); }
    });
  };

  /* Bolehkah urutan opsi diacak di Mode Latihan?
     Tidak, bila opsi berupa angka/relasi berurutan, gambar, atau pembahasan menyebut huruf opsi. */
  window.bolehAcakTampilan = function (q) {
    if (q.tipe !== "pilihan" || q.generated) return false;
    if (q.opsi.some(function (o) { return /<svg/.test(o.teks); })) return false;
    var v = q.opsi.map(function (o) { return teks(o.teks); });
    if (v.every(function (x) { return /^[\d.,\s%Rp−-]+$/.test(x); }) || /x [<>=]/.test(v.join(" "))) return false;
    var pb = q.pembahasan, prosa = [pb.konsep, (pb.langkah || []).join(" "), pb.caraCepat, pb.soalSerupa && pb.soalSerupa.pertanyaan, pb.soalSerupa && pb.soalSerupa.jawaban, q.pertanyaan].map(teks).join(" ");
    return !/(^|[^A-Za-z0-9])[A-E](?=[^A-Za-z0-9]|$)/.test(prosa);
  };

  /* Sebar posisi kunci untuk soal baru (pilihan) secara deterministik berdasarkan ID,
     agar kunci tidak menumpuk di satu huruf. Peta "kenapa opsi lain salah" ikut dipetakan ulang.
     Dilewati bila prosa pembahasan menyebut huruf opsi (A–E). */
  window.sebarKunci = function (o) {
    if (!o || !o.o || Array.isArray(o.o[0]) || !o.a) return o;
    var p = o.p || {}, prosa = [p.k, (p.l || []).join(" "), p.c, p.s && p.s.join(" "), o.q].map(teks).join(" ");
    if (/(^|[^A-Za-z0-9])[A-E](?=[^A-Za-z0-9]|$)/.test(prosa)) return o;
    var h = 0; for (var i = 0; i < o.id.length; i++) h = (h * 31 + o.id.charCodeAt(i)) >>> 0;
    var dari = KODE.indexOf(o.a), ke = h % 5;
    if (dari < 0 || dari === ke) return o;
    var opsi = o.o.slice(), kunci = opsi.splice(dari, 1)[0]; opsi.splice(ke, 0, kunci);
    var lama = [0, 1, 2, 3, 4].filter(function (i) { return i !== dari; }), baru = [0, 1, 2, 3, 4].filter(function (i) { return i !== ke; }), peta = {};
    peta[KODE[dari]] = KODE[ke]; lama.forEach(function (li, j) { peta[KODE[li]] = KODE[baru[j]]; });
    if (p.x && !p.x.lain) { var nx = {}; Object.keys(p.x).forEach(function (k) { nx[peta[k] || k] = p.x[k]; }); p.x = nx; }
    o.o = opsi; o.a = KODE[ke];
    return o;
  };

  /* Validator otomatis — dipanggil oleh aplikasi saat dimuat.
     Mengembalikan array masalah (galat). Properti tambahan: .peringatan dan .statistik. */
  window.validasiBank = function (bank) {
    var masalah = [], peringatan = [], ids = {}, tanda = {}, stat = {};
    bank.forEach(function (q) {
      var id = q.id || "(tanpa id)";
      if (ids[id]) masalah.push(id + ": ID duplikat");
      ids[id] = true;
      if (!q.opsi || q.opsi.length !== 5) masalah.push(id + ": jumlah opsi bukan 5");
      else {
        var kode = q.opsi.map(function (o) { return o.kode; }).join("");
        if (kode !== "ABCDE") masalah.push(id + ": kode opsi harus A–E");
        var tk = q.opsi.map(function (o) { return teks(o.teks) || o.teks; });
        if (new Set(tk).size !== 5) masalah.push(id + ": ada teks opsi yang kembar");
        if (q.tipe === "pilihan") {
          var lima = q.opsi.filter(function (o) { return o.skor === 5; }).length;
          var lain = q.opsi.filter(function (o) { return o.skor !== 5 && o.skor !== 0; }).length;
          if (lima !== 1) masalah.push(id + ": harus tepat satu opsi bernilai 5 (ditemukan " + lima + ")");
          if (lain) masalah.push(id + ": opsi salah harus bernilai 0");
        } else if (q.tipe === "skala") {
          var s = q.opsi.map(function (o) { return o.skor; }).sort().join("");
          if (s !== "12345") masalah.push(id + ": skor skala harus unik 1–5 (ditemukan " + s + ")");
        } else masalah.push(id + ": tipe tidak dikenal");
      }
      var pb = q.pembahasan || {};
      if (!pb.konsep && !(pb.langkah && pb.langkah.length)) masalah.push(id + ": pembahasan kosong");
      if (!q.pertanyaan) masalah.push(id + ": pertanyaan kosong");
      if (["mudah", "sedang", "sulit"].indexOf(q.kesulitan) < 0) masalah.push(id + ": label kesulitan tidak dikenal (" + q.kesulitan + ")");
      /* duplikasi isi */
      var sig = q.subtes + "|" + teks(q.pertanyaan).toLowerCase() + "|" + (q.gambar || "") + "|" + (q.opsi || []).map(function (o) { return teks(o.teks) || o.teks; }).sort().join("#");
      if (tanda[sig]) peringatan.push(id + ": isi sama persis dengan " + tanda[sig]); else tanda[sig] = id;
      /* statistik per subtes */
      var st = stat[q.subtes] || (stat[q.subtes] = { n: 0, kunci: { A: 0, B: 0, C: 0, D: 0, E: 0 }, kunciTampil: { A: 0, B: 0, C: 0, D: 0, E: 0 }, nKunci: 0, terpanjang: 0, nPanjang: 0, kes: { mudah: 0, sedang: 0, sulit: 0 }, hukum: 0, perluRujukan: 0, bocor: [] });
      st.n++; st.kes[q.kesulitan] = (st.kes[q.kesulitan] || 0) + 1;
      if (q.bermuatanHukum) st.hukum++;
      if (q.perluRujukan) st.perluRujukan++;
      if (q.tipe === "pilihan" && q.opsi && q.opsi.length === 5 && !q.opsi.some(function (o) { return /<svg/.test(o.teks); })) {
        var k = q.opsi.filter(function (o) { return o.skor === 5; })[0];
        if (k) {
          st.nKunci++; st.kunci[k.kode]++;
          if (!window.bolehAcakTampilan(q)) st.kunciTampil[k.kode]++;
          else KODE.forEach(function (h) { st.kunciTampil[h] += 0.2; });
          var L = q.opsi.map(function (o) { return teks(o.teks).length; }), kl = teks(k.teks).length;
          var lainMax = Math.max.apply(null, q.opsi.filter(function (o) { return o !== k; }).map(function (o) { return teks(o.teks).length; }));
          if (!q.generated && L.some(function (x) { return x > 12; })) {
            st.nPanjang++;
            if (kl > lainMax) st.terpanjang++;
            if (kl >= 1.6 * lainMax && kl - lainMax >= 25) st.bocor.push(id);
          }
        }
      }
    });
    Object.keys(stat).forEach(function (sub) {
      var st = stat[sub];
      if (st.nPanjang >= 20 && st.terpanjang / st.nPanjang > 0.4) peringatan.push(sub + ": jawaban benar menjadi opsi terpanjang pada " + Math.round(st.terpanjang / st.nPanjang * 100) + "% soal (acak ±20%). Soal paling mencolok: " + st.bocor.slice(0, 8).join(", ") + (st.bocor.length > 8 ? " …" : ""));
      if (st.nKunci >= 20) {
        var mx = Math.max.apply(null, KODE.map(function (h) { return st.kunciTampil[h]; }));
        if (mx / st.nKunci > 0.35) peringatan.push(sub + ": sebaran kunci di Mode Latihan masih condong (" + KODE.map(function (h) { return h + " " + Math.round(st.kunciTampil[h] / st.nKunci * 100) + "%"; }).join(", ") + ")");
      }
      if (st.n >= 20 && sub !== "TKP" && sub !== "SKB-PSI") {
        var pm = st.kes.mudah / st.n, ps = st.kes.sedang / st.n, pt = st.kes.sulit / st.n;
        if (Math.abs(pm - 0.3) > 0.15 || Math.abs(ps - 0.5) > 0.15 || Math.abs(pt - 0.2) > 0.15) peringatan.push(sub + ": proporsi kesulitan " + Math.round(pm * 100) + "/" + Math.round(ps * 100) + "/" + Math.round(pt * 100) + " (target 30/50/20)");
      }
      if (st.perluRujukan) peringatan.push(sub + ": " + st.perluRujukan + " soal bermuatan hukum belum punya dasar hukum/rujukan");
    });
    if (masalah.length) {
      console.warn("[Validator Bank Soal] " + masalah.length + " masalah ditemukan:");
      masalah.forEach(function (m) { console.warn("  • " + m); });
    } else {
      console.info("[Validator Bank Soal] Semua " + bank.length + " soal lolos validasi." + (peringatan.length ? " " + peringatan.length + " peringatan mutu." : ""));
    }
    peringatan.forEach(function (m) { console.info("  ⚠ " + m); });
    masalah.peringatan = peringatan;
    masalah.statistik = stat;
    return masalah;
  };
})();
