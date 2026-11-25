# CHANGELOG — Simulasi CAT Dosen

## 2026-11-26 — Fokus formasi Kemenag / UIN SGD – FDK

Tujuan: setiap fitur menjawab “apakah ini menaikkan skor/peringkat saya?”.

### Langkah 0 — Arsitektur & migrasi
- Stack tetap: satu `index.html` (HTML/CSS/JS vanilla) + bank soal `soal/*.js`, data di `localStorage` (`catdosen_*`), tanpa backend.
- **Migrasi berversi** (`catdosen_schema` = 2): menambah field progres (`sum`, `ns`, `c34`, `lt`, `lb`), membuat `catdosen_pernah` dari riwayat/`usedSim`, dan mengisi antrean pengulangan `catdosen_srs` dari soal salah. Tidak ada data lama yang dihapus.
- **File ekspor lama tetap bisa diimpor**: file tanpa `schemaVersion` memicu migrasi ulang setelah impor. Diuji dengan file ekspor format v1.
- Formasi bawaan lama (`kemdiktisaintek` yang tidak pernah dipilih) dipindah ke `kemenag`.

### Fase 1 — Kualitas soal
- `tools/audit-soal.cjs`: audit **independen** 173 soal otomatis (kunci dihitung ulang dari teks/SVG soal). Hasil: 0 kunci salah, 0 ambigu, 0 perlu cek manual. Detail di `AUDIT-SOAL.md`.
- Generator kini menolak soal kembar (4 soal dibuat ulang) dan tidak lagi membuat pengecoh negatif.
- Validator diperluas: duplikasi isi, sebaran kunci A–E, kebocoran “jawaban benar = opsi terpanjang”, label kesulitan, soal bermuatan hukum tanpa rujukan. Laporannya tampil di **Pengaturan → Laporan mutu bank soal**.
- `soal/perbaikan-mutu.js`: pengecoh 75 soal lama diperpanjang (kebocoran mencolok 75 → 4) dan rujukan ditambahkan untuk 7 soal hukum.
- Mode Latihan mengacak urutan opsi (bila pembahasan tidak menyebut huruf opsi); label dan pembahasan ikut dipetakan.
- Tombol **⚑ Laporkan** di setiap soal latihan dan pembahasan simulasi; laporan dapat diekspor (JSON).
- Field `dasarHukum` dan `terakhirDicek` pada setiap soal; soal bermuatan hukum tanpa rujukan diberi peringatan.

### Fase 2 — Formasi Kemenag / UIN SGD – FDK
- Formasi bawaan **Dosen S2 — Kemenag (PTKIN)**; preset baru **UIN Sunan Gunung Djati Bandung – Fakultas Dakwah dan Komunikasi**.
- Bank **SKB Moderasi Beragama** (75 soal): konsep, 4 indikator, kasus kampus PTKIN, dakwah digital, kebijakan Kemenag.
- Bank **SKB Kompetensi Bidang Dakwah & Komunikasi** (100 soal): ilmu dakwah, KPI, manajemen dakwah, haji–umrah–zakat–wakaf, BKI/PMI, humas & jurnalistik, retorika, metodologi. Setiap soal memuat konsep, alasan opsi lain salah, dan rujukan.
- Posisi kunci soal baru disebar otomatis (A–E ±20%).
- Komposisi, durasi SKB, dan bobot SKD/SKB **bisa diatur per formasi** di Pengaturan, dengan peringatan “Sesuaikan dengan pengumuman resmi Kemenag/SSCASN BKN”.
- Materi ringkas Moderasi Beragama dan Bidang FDK di `#/materi`.

### Fase 3 — Penentu peringkat
- Kalkulator nilai akhir (bobot bawaan 40/60, rumus ditampilkan, berlabel verifikasi).
- Target skor pribadi; hasil simulasi menampilkan **kekurangan poin terhadap ambang batas dan target**.
- Paparan bank soal (persentase soal yang pernah keluar), opsi **utamakan soal baru**, skor soal baru vs ulangan, dan peringatan bila skor naik karena soal berulang.
- Waktu per soal saat simulasi: pola waktu per subtes, soal benar tetapi lambat (> 70 detik), saran urutan pengerjaan.
- TKP per aspek BerAKHLAK: rata-rata poin 1–5 dan porsi pilihan bernilai 3–4.

### Fase 4 — Sistem belajar
- Pengulangan berkala 1–3–7–14 hari (salah, ragu-ragu, benar tetapi lambat); keluar setelah benar 3× berturut-turut dengan waktu normal.
- Tanggal ujian → hitung mundur, rencana harian ke subtopik terlemah, pengingat simulasi penuh mingguan.
- Dashboard kesiapan per subtes (hanya soal baru, maks. 3 simulasi terakhir) dengan rumus yang ditampilkan.

### Fase 5 — SKB non-CAT
- Perekam audio/video di browser, disimpan di **IndexedDB perangkat** (tidak diunggah); tab “Rekaman saya”.
- Latihan wawancara bertimer (1–2 menit) + rubrik penilaian diri (STAR, kejelasan, relevansi Tri Dharma & moderasi, ketepatan waktu) dan riwayat skor.
- 12 pertanyaan wawancara khusus PTKIN/UIN SGD–FDK.
- Microteaching: 12 topik mata kuliah FDK, template rencana sesi (CPMK, metode, asesmen), timer sesi 5–30 menit dengan penanda tahap.

### Fase 6 — Teknis
- PWA: `manifest.webmanifest`, ikon 192/512/maskable, `sw.js` (offline, pembaruan latar belakang). Tidak aktif di pratinjau claude.ai.
- Kontrol formulir minimal 44px, cincin fokus terlihat, tabel lebar bisa digeser di dalam kotaknya pada HP, mode gelap konsisten.

### Jumlah soal per subtes

| Subtes | Sebelum | Sesudah |
|---|---|---|
| TWK | 90 | 90 (pengecoh 19 soal diperbaiki, 4 rujukan ditambah) |
| TIU | 141 | 141 (4 soal otomatis dibuat ulang, pengecoh negatif di 2 soal dihapus, pengecoh 1 soal diperbaiki) |
| TKP | 135 | 135 |
| SKB Etika & Tri Dharma | 82 | 82 (pengecoh 42 soal diperbaiki) |
| SKB Bahasa Inggris | 75 | 75 (pengecoh 7 soal diperbaiki) |
| SKB Penalaran | 75 | 75 (pengecoh 6 soal diperbaiki) |
| SKB Dimensi Psikologi | 75 | 75 |
| **SKB Moderasi Beragama** | 0 | **75** |
| **SKB Bidang Dakwah & Komunikasi** | 0 | **100** |
| **Total** | **673** | **848** |

### Perlu verifikasi manual oleh Anda
1. **Komposisi, jumlah soal, durasi, dan bobot SKB** untuk formasi Kemenag/UIN SGD — angka bawaan adalah perkiraan (Kemenag: Etika 20, Moderasi 30, Inggris 25, Penalaran 25; FDK: Bidang 40, Moderasi 30, Etika 15, Inggris 15; bobot 40/60).
2. **Nilai ambang batas SKD** (65/80/166) dan ambang formasi khusus (311) terhadap KepmenPANRB terbaru.
3. **29 soal berlabel “perlu verifikasi”**, antara lain Perpres 58/2023, PBM 9 & 8/2006 (FKUB/rumah ibadat), RPJMN 2020–2024, “Tahun Toleransi 2022”, keputusan Muktamar Muhammadiyah 2015 & NU 1984, UU ITE (UU 1/2024), UU 8/2019, UU 34/2014, unsur wakaf UU 41/2004, fungsi penyuluh agama, Rumah Moderasi Beragama, serta rincian Permendiktisaintek 52/2025.
4. **99 soal bermuatan hukum** belum diberi tanggal `terakhirDicek` — isi setelah dicocokkan dengan naskah resmi.
5. Rumusan resmi paradigma **“Wahyu Memandu Ilmu”** dan daftar mata kuliah FDK di dokumen kampus.
6. **Kebocoran panjang opsi yang tersisa**: jawaban benar masih cenderung lebih panjang pada sebagian soal lama (TWK ±52%, SKB Etika ±64%, SKB Inggris ±70%, SKB Moderasi ±72%); daftar ada di Pengaturan → Laporan mutu.
7. **Perekaman audio/video dan PWA offline** belum diuji di perangkat fisik; uji di HP Anda melalui situs GitHub Pages.
8. Target skor pribadi bawaan (TWK 100, TIU 120, TKP 185, SKB 400/500) — sesuaikan dengan target Anda.
