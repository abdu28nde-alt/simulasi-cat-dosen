# CAT CPNS Dosen — Latihan & Simulasi

Website latihan mandiri CAT CPNS formasi Dosen lulusan Magister (SKD + SKB Dosen). Tanpa backend, tanpa login, berjalan offline.

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
| `soal/materi.js` | Materi ringkas + modul wawancara/microteaching |

## Menambah soal
Tambahkan objek ke salah satu `soal-*.js` dengan format ringkas (lihat komentar di `soal/soal.js`). Validator di console akan memperingatkan bila ada ID ganda, opsi bukan 5, kunci ganda, atau skor skala tidak unik 1–5.

## Status bank soal
| Subtes | Jumlah | Target |
|---|---|---|
| TWK | 90 | 90 ✅ |
| TIU | 141 (108 otomatis) | 105 ✅ |
| TKP | 135 | 135 ✅ |
| SKB Etika & Tri Dharma | 75 umum + 7 Kemenag | 75 ✅ |
| SKB Bahasa Inggris | 75 | 75 ✅ |
| SKB Penalaran | 75 (65 otomatis) | 75 ✅ |
| SKB Dimensi Psikologi | 75 | 75 ✅ |

Total 673 soal. Sudah diuji: 3 paket SKD dan 3 paket SKB berturut-turut tanpa soal berulang.

Soal bertanda `perlu verifikasi` menyangkut aturan yang dapat berubah (mis. Permendiktisaintek 52/2025, MBKM). Cek naskah resmi terbaru.

*Website latihan mandiri, bukan aplikasi resmi BKN/SSCASN.*
