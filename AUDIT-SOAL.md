# Laporan Audit Soal Otomatis

Dibuat dengan `node tools/audit-soal.cjs` (pemeriksa independen: kunci dihitung ulang dari **teks soal**, bukan dari kode generator).

## Cakupan
| Kelompok | Jumlah | Cara pemeriksaan |
|---|---|---|
| TIU Numerik – Berhitung | 18 | Ekspresi diurai dan dievaluasi ulang (persen, pecahan, akar, pangkat, urutan operasi) |
| TIU Numerik – Deret | 18 | Pemecah pola independen (aritmetika, geometri, ×m+c, bertingkat, selang-seling, Fibonacci, huruf); memeriksa juga apakah ada pola lain yang memberi jawaban berbeda |
| TIU Perbandingan Kuantitatif | 14 | x dan y dihitung ulang; dicek tidak ada dua opsi benar (mis. 2x = y) |
| TIU Soal Cerita | 21 | Rumus kerja bersama, kecepatan rata-rata, untung-rugi, rata-rata gabungan, umur, nilai berikutnya |
| TIU Figural (serial, analogi, ketidaksamaan) | 37 | SVG dibaca ulang: posisi titik, sudut panah/bendera, cerminan, jumlah sisi/titik, isi bangun; dipastikan tepat satu opsi memenuhi aturan |
| SKB Penalaran (data) | 65 | Persentase kelulusan, perubahan persen, rata-rata berbobot, rasio, pembulatan ke atas/bawah, IP semester |

## Temuan & perbaikan
| Temuan | Soal | Tindakan |
|---|---|---|
| Teks soal identik | TIU-GEN-HIT-002 = HIT-014 | HIT-014 dibuat ulang (generator kini menolak soal kembar) |
| Teks soal identik | TIU-GEN-CER-002 = CER-009 = CER-016 | CER-009 dan CER-016 dibuat ulang |
| Gambar & opsi identik | TIU-GEN-FIGK-008 = FIGK-011 | FIGK-011 dibuat ulang |
| Pengecoh bernilai negatif padahal jawaban positif | TIU-GEN-HIT-003, HIT-015 | Batas bawah pengecoh diubah ke 0 |
| Kunci salah | — | Tidak ditemukan |
| Lebih dari satu jawaban benar / pola ambigu | — | Tidak ditemukan |

**Hasil akhir:** 173 dari 173 soal otomatis lolos pemeriksaan independen; 0 soal perlu cek manusia.

> Catatan: soal yang dibuat ulang memakai ID yang sama tetapi isinya berbeda. Riwayat latihan lama untuk 4 ID tersebut (HIT-014, CER-009, CER-016, FIGK-011) merujuk soal lama.
