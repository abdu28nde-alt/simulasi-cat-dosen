# CAT CPNS Dosen — Latihan & Simulasi

Website latihan mandiri CAT CPNS formasi Dosen lulusan Magister (SKD + SKB Dosen). Tanpa backend, tanpa login, berjalan offline.

**Situs publik:** https://abdu28nde-alt.github.io/simulasi-cat-dosen/ (GitHub Pages, tanpa login)

## Memperbarui situs
Ubah berkas di folder ini, lalu jalankan `git add -A`, `git commit -m "pesan"`, dan `git push`. GitHub Pages memperbarui situs dalam 1–2 menit.

## Cara menjalankan
Buka `index.html` langsung di browser (klik dua kali). Semua progres tersimpan di `localStorage` perangkat tersebut. Untuk pindah perangkat gunakan **Pengaturan → Ekspor/Impor progres**.

Mode debug (durasi simulasi 1 menit): centang di **Pengaturan**, atau buka `index.html?debug=1`.

## Struktur
| Berkas | Isi |
|---|---|
| `index.html` | UI, `CONFIG` (passing grade, durasi, komposisi SKB, bobot 40/60), mesin penilaian, latihan, simulasi, statistik |
| `soal/soal.js` | Helper `addSoal()` + validator otomatis |
| `soal/generator.js` | Generator berbenih: TIU numerik, TIU figural (SVG), SKB Penalaran (data) — jawaban dihitung kode |
| `soal/soal-twk.js`, `soal-tiu.js`, `soal-tkp.js`, `soal-skb.js` | Bank soal tulisan manual |
| `soal/soal-twk2.js`, `soal-tkp2.js`, `soal-skb-etika2.js`, `soal-skb-ing2.js`, `soal-skb-psi2.js` | Bank soal tambahan |
| `soal/materi.js`, `materi-kemenag-fdk.js`, `noncat-fdk.js` | Materi ringkas, modul wawancara/microteaching, bahan PTKIN/FDK |
| `soal/soal-moderasi.js`, `soal-dakwah-komunikasi.js` | Bank SKB Moderasi Beragama dan Bidang Dakwah & Komunikasi |
| `soal/perbaikan-mutu.js` | Perbaikan pengecoh dan rujukan (dimuat terakhir) |
| `sw.js`, `manifest.webmanifest`, `icon*` | PWA (pasang & offline) |

## Menambah soal
Tambahkan objek ke salah satu `soal-*.js` dengan format ringkas (lihat komentar di `soal/soal.js`). Validator di console akan memperingatkan bila ada ID ganda, opsi bukan 5, kunci ganda, atau skor skala tidak unik 1–5.

## Status bank soal
Total 848 soal: TWK 90, TIU 141, TKP 135, SKB Etika 82 (termasuk 7 khusus Kemenag), SKB Bahasa Inggris 75, SKB Penalaran 75, SKB Dimensi Psikologi 75, **SKB Moderasi Beragama 75**, **SKB Bidang Dakwah & Komunikasi 100** (preset UIN SGD – FDK). Riwayat perubahan di CHANGELOG.md, audit soal otomatis di AUDIT-SOAL.md.

## Alat bantu (Node.js)
- `node tools/audit-soal.cjs` — audit independen kunci soal otomatis
- `node tools/cek-sintaks.cjs` — cek sintaks skrip
- `node tools/ganti-teks.cjs berkas.js peta.json` — ganti teks opsi secara aman
- `node tools/buat-ikon.cjs` — buat ulang ikon PWA

Soal bertanda `perlu verifikasi` menyangkut aturan yang dapat berubah (mis. Permendiktisaintek 52/2025, MBKM). Cek naskah resmi terbaru.

*Website latihan mandiri, bukan aplikasi resmi BKN/SSCASN.*
