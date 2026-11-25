/* =========================================================
   PERBAIKAN MUTU SOAL (Fase 1)
   Dimuat SETELAH semua berkas soal. Berisi:
   1) Pengecoh yang diperpanjang agar jawaban benar tidak selalu
      menjadi opsi terpanjang (alasan salahnya tetap sama sehingga
      pembahasan "kenapa opsi lain salah" tetap berlaku).
   2) Dasar hukum/rujukan untuk soal bermuatan hukum yang belum punya.
   ========================================================= */
(function () {
  var idx = {}; window.BANK.forEach(function (q) { idx[q.id] = q; });
  function opsi(id, map) {
    var q = idx[id]; if (!q) { console.warn("[Perbaikan] ID tidak ditemukan:", id); return; }
    Object.keys(map).forEach(function (k) {
      var o = q.opsi.filter(function (x) { return x.kode === k; })[0];
      if (!o) return;
      if (o.skor === 5) { console.warn("[Perbaikan] Tidak boleh mengubah kunci:", id, k); return; }
      o.teks = map[k];
    });
    q.diperbaiki = true;
  }
  function rujukan(id, h, cek) {
    var q = idx[id]; if (!q) return;
    q.pembahasan.dasarHukum = h; q.dasarHukum = h; q.bermuatanHukum = true; q.perluRujukan = false;
    if (cek) q.terakhirDicek = cek;
  }

  /* ---------- 1) Pengecoh ---------- */
  opsi("TIU-SIL-009", { A: "Rina pasti lulus ujian komprehensif karena sudah mendaftar wisuda", B: "Rina tidak lulus ujian komprehensif, tetapi tetap boleh mendaftar wisuda", D: "Semua mahasiswa yang mendaftar wisuda pasti lulus ujian komprehensif" });
  opsi("SKB-NAL-002", { A: "Kembali ke sistem KRS manual agar keluhan mahasiswa segera berhenti", D: "Mengabaikan karena penurunan 0,5 poin masih dalam batas yang wajar", E: "Mengganti staf administrasi yang menangani sistem KRS daring" });
  opsi("SKB-NAL-005", { A: "Kehadiran pasti menyebabkan nilai tinggi, sehingga presensi harus diwajibkan 100%", C: "Kehadiran tidak berhubungan dengan nilai karena selisih rata-ratanya kecil", D: "Mahasiswa yang kehadirannya di bawah 80% pasti malas dan kurang belajar" });
  opsi("SKB-NAL-006", { A: "Memberi nilai nol kepada yang tidak mengumpulkan dan melanjutkan materi", C: "Membatalkan semua tugas daring dan menggantinya dengan ujian tatap muka", D: "Melaporkan semua mahasiswa yang tidak mengumpulkan tugas kepada prodi" });
  opsi("SKB-NAL-008", { A: "Verifikasi berkas, dengan menambah jumlah petugas verifikasi", C: "Pencetakan dan stempel, dengan mengganti mesin cetak yang lebih cepat", D: "Menambah tahap pemeriksaan ulang agar tidak ada kesalahan data" });
  opsi("SKB-NAL-009", { A: "Membubarkan kedua kelompok dan meminta setiap mahasiswa mengerjakan proyek sendiri", B: "Memberi nilai yang sama kepada semua anggota tanpa melihat kontribusi masing-masing", D: "Menyuruh mereka menyelesaikan perselisihan sendiri tanpa campur tangan dosen" });
  opsi("SKB-NAL-010", { B: "Publikasi naik sekitar 10% setiap tahun selama periode 2022–2024", C: "Publikasi turun 5% dari 2023 ke 2024 karena berkurang 5 artikel", E: "Publikasi naik 25% dari 2022 ke 2024 dan terus meningkat setiap tahun" });
  opsi("TWK-NAS-009", { A: "Menerima karena dana riset sulit didapat dan hasilnya tetap bermanfaat bagi perkembangan ilmu pengetahuan", B: "Menerima dengan syarat nama Anda menjadi penulis utama pada setiap publikasi yang dihasilkan", D: "Menerima tetapi hanya mengirim sebagian sampel agar kekayaan hayati yang keluar tidak terlalu banyak" });
  opsi("TWK-INT-004", { A: "Mendiamkan karena urusan kenaikan jabatan rekan bukan tanggung jawab Anda", B: "Menyebarkan temuan di grup dosen agar semua rekan waspada terhadap plagiarisme", D: "Langsung melaporkan temuan kepada media massa agar menimbulkan efek jera" });
  opsi("TWK-INT-005", { A: "Menerima asalkan harga penawaran tetap wajar dan spesifikasi alat sesuai dokumen pemilihan", C: "Menolak tawaran tersebut, tetapi tidak menceritakannya kepada siapa pun agar tidak timbul masalah", D: "Menerima lalu menyumbangkan seluruh uangnya ke kas prodi untuk kegiatan mahasiswa" });
  opsi("TWK-INT-006", { A: "Jujur dalam ucapan dan tindakan", B: "Mandiri dalam menyelesaikan tugas", C: "Sederhana dalam gaya hidup", D: "Berani menolak penyimpangan" });
  opsi("TWK-INT-007", { A: "Menaikkan nilai untuk menjaga hubungan baik dengan pimpinan kampus", C: "Menaikkan nilai sedikit saja karena mahasiswa sudah berusaha keras", D: "Meminta mahasiswa membawa surat permohonan resmi dari orang tuanya" });
  opsi("TWK-BEL-004", { A: "Agresi Militer Belanda I pada Juli 1947", C: "Serangan Umum 1 Maret 1949 di Yogyakarta", D: "Pertempuran 10 November 1945 di Surabaya", E: "Konferensi Meja Bundar di Den Haag tahun 1949" });
  opsi("TWK-PIL-020", { C: "Terbuka terhadap semua ideologi tanpa batas, termasuk yang bertentangan dengan nilai dasarnya", D: "Tidak memiliki nilai dasar yang tetap sehingga mudah disesuaikan dengan kepentingan", E: "Hanya berlaku bagi penyelenggara negara, bukan bagi seluruh warga negara" });
  opsi("TWK-PIL-021", { A: "Kedaulatan tetap berada di tangan MPR sepenuhnya sebagai lembaga tertinggi negara", C: "Presiden menjadi pemegang kedaulatan tertinggi karena dipilih langsung oleh rakyat", E: "DPR menjadi lembaga tertinggi negara menggantikan kedudukan MPR sebelumnya" });
  opsi("TWK-NAS-015", { A: "Memilih alat impor karena lebih bergengsi bagi reputasi laboratorium", C: "Membeli keduanya dalam jumlah yang sama agar adil bagi semua penyedia", D: "Menyerahkan pilihan merek sepenuhnya kepada penyedia pemenang lelang" });
  opsi("TWK-NAS-017", { B: "Strategi militer untuk menghadapi ancaman kedaulatan dari negara-negara tetangga", C: "Kebijakan luar negeri bebas aktif dalam pergaulan dan kerja sama internasional", E: "Pandangan bahwa setiap pulau berdiri sendiri sesuai dengan budaya masing-masing" });
  opsi("TWK-INT-009", { A: "Menerima karena dilakukan di luar jam kerja dan tidak mengganggu perkuliahan", B: "Menerima asalkan alat tidak rusak dan dibersihkan kembali setelah dipakai", E: "Menolak semua bentuk kerja sama dengan perusahaan agar tidak timbul masalah" });
  opsi("TWK-INT-010", { A: "Membiarkan karena presensi hanya urusan administrasi perkuliahan", C: "Mencoret nama semua mahasiswa yang hadir pada pertemuan tersebut", D: "Mempermalukan kedua mahasiswa di depan kelas sebagai pelajaran bagi yang lain" });
  opsi("TWK-INT-013", { A: "Wajar sebagai uang lelah; menerima tawaran karena berkas menjadi cepat selesai", C: "Gratifikasi yang diperbolehkan asal nilainya kecil; menerima tawaran tersebut", E: "Bukan pelanggaran karena bersifat sukarela; menegosiasikan besaran biayanya" });
  opsi("TWK-INT-015", { A: "Ikut membantu demi nama baik prodi dan kelancaran proses akreditasi", B: "Diam agar tidak bermasalah dengan atasan yang menilai kinerja Anda", D: "Menyebarkan informasi itu ke media sosial agar segera diketahui publik" });
  opsi("TWK-INT-016", { C: "Langsung merobek lembar jawabannya di depan peserta ujian yang lain", D: "Memberi peringatan lisan, lalu tidak mencatatnya agar masalah tidak berlarut-larut", E: "Mengusir seluruh peserta di ruangan karena dianggap ikut membiarkan kecurangan" });
  opsi("TWK-INT-017", { A: "Hak dosen sebagai penulis untuk menetapkan bukunya sebagai bacaan wajib yang harus dibeli", C: "Bentuk pengabdian kepada masyarakat melalui penyebarluasan karya ilmiah dosen", D: "Praktik yang dianjurkan kampus untuk menambah penghasilan dosen di luar gaji" });
  opsi("TWK-BEL-010", { A: "Meneruskan semua berita viral agar keluarga dan teman cepat mengetahuinya", C: "Menghindari media sosial sepenuhnya agar tidak terpapar informasi yang menyesatkan", D: "Membalas ujaran kebencian dengan ujaran serupa supaya pelakunya jera" });
  opsi("TWK-BEL-013", { A: "Menggunakan istilah asing dalam semua forum resmi agar terkesan modern dan profesional", C: "Menolak mempelajari bahasa asing demi menjaga kemurnian bahasa Indonesia", D: "Mengikuti upacara bendera hanya jika diwajibkan dan diawasi oleh pimpinan" });
  opsi("TWK-BEL-014", { A: "Hanya melibatkan TNI sebagai satu-satunya kekuatan pertahanan negara", C: "Hanya dilaksanakan ketika negara sedang berada dalam keadaan perang", D: "Hanya mengandalkan alat utama sistem senjata yang canggih dan modern" });
  opsi("SKB-ING-006", { A: "consider their results final and not in need of any further study", C: "recommend replacing all face-to-face classes with online modules", D: "found that blended learning harmed students' engagement overall" });
  opsi("SKB-ING-011", { A: "Peer review is too slow and inconsistent to be useful for modern science", C: "Reviewers mainly check grammar and formatting rather than research methods", E: "Peer review is always consistent and has never been seriously criticized" });
  opsi("SKB-ING-027", { A: "MOOCs offered by Indonesian universities generally have high completion rates", C: "Older learners are more likely to complete MOOCs than younger learners", D: "Gender is the main factor that determines whether learners complete a MOOC" });
  opsi("SKB-ING-030", { B: "Removing inactive learners from the course", C: "Recording every lecture for later viewing", D: "Testing learners at the end of each module" });
  opsi("SKB-ING-031", { A: "Removing discussion forums so that learners can focus on watching videos", B: "Requiring learners to state their age and gender before they enroll", D: "Making courses longer so that learners have more time to finish them" });
  opsi("SKB-ING-032", { A: "Medicine is the most important field that is affected by scientific research", C: "Students should not conduct research until they have completed their degree", D: "Funding for science is too high and is often wasted on unnecessary projects" });
  opsi("SKB-ING-045", { A: "Lecturers give too much individual attention to some students", C: "The videos that students watch at home are generally too short", D: "Problem-solving discussions in class are boring for most students" });

  opsi("SKB-ETK-002", { A: "Langsung menyatakan mahasiswa gagal karena plagiarisme adalah pelanggaran berat", B: "Membiarkan karena kalimatnya sudah diparafrase sehingga tidak lagi dianggap menyalin", E: "Melaporkannya ke komisi etik tanpa memberi tahu atau membina mahasiswa lebih dulu" });
  opsi("SKB-ETK-006", { A: "Daftar buku ajar dan referensi yang sudah tersedia di perpustakaan", D: "Jumlah dosen yang tersedia untuk mengampu setiap mata kuliah", E: "Metode ujian yang biasa dipakai oleh dosen pada tahun sebelumnya" });
  opsi("SKB-ETK-013", { A: "Mencantumkan namanya sebagai penulis kedua karena ia telah memberi izin dan dukungan fasilitas", B: "Mencantumkan namanya sebagai penulis korespondensi agar artikel lebih mudah diterima jurnal", D: "Menunda publikasi artikel tersebut sampai pejabat yang bersangkutan pensiun dari jabatannya" });
  opsi("SKB-ETK-014", { A: "Praktik yang wajar untuk mempercepat publikasi di tengah antrean jurnal", C: "Diperbolehkan asalkan kedua jurnal menggunakan bahasa yang berbeda", E: "Baru menjadi pelanggaran jika kedua jurnal akhirnya menerbitkan artikel itu" });
  opsi("SKB-ETK-017", { A: "Menuliskan bagian analisis itu agar skripsi cepat selesai dan mahasiswa tidak tertunda lulus", B: "Meminta asisten peneliti Anda menuliskan bagian analisis atas nama mahasiswa", D: "Mengganti topik skripsinya dengan topik yang tidak memerlukan analisis data" });
  opsi("SKB-ETK-023", { A: "Menerima dan memberi penilaian yang baik karena Anda paling memahami penelitiannya", B: "Menerima dan menilai lebih ketat agar tidak dianggap memihak mahasiswa sendiri", E: "Meminta mahasiswa merevisi naskahnya lebih dulu sebelum Anda menelaahnya" });
  opsi("SKB-ETK-025", { A: "Mencantumkan AI sebagai salah satu penulis karena turut menyusun kalimat dalam naskah", B: "Tidak perlu menyebutkan apa pun karena AI hanya dipakai untuk memperbaiki tata bahasa", D: "Membiarkan AI menulis bagian diskusi agar argumentasi lebih runtut dan meyakinkan" });
  opsi("SKB-ETK-026", { A: "Kebebasan dosen menyampaikan pendapat apa saja di dalam dan di luar kelas tanpa batas apa pun", D: "Hak dosen untuk menolak tugas Tri Dharma yang tidak sesuai dengan minat penelitiannya", E: "Kebebasan perguruan tinggi dari segala bentuk pengawasan dan akuntabilitas kepada negara" });
  opsi("SKB-ETK-028", { A: "Menaikkan semua nilai agar persentase kelulusan mata kuliah tetap terjaga", B: "Menghapus soal analisis pada ujian akhir karena terbukti terlalu sulit bagi mahasiswa", E: "Mengganti seluruh materi kuliah dengan materi baru yang lebih mudah dipahami" });
  opsi("SKB-MOD-001", { A: "Pemurnian ajaran dengan memisahkan praktik keagamaan dari budaya lokal", C: "Penyeragaman tafsir keagamaan agar tidak terjadi perbedaan pendapat", D: "Pemisahan agama dari kehidupan sosial dan urusan kenegaraan" });
  opsi("SKB-MOD-002", { A: "Mengabulkan permintaannya agar suasana kelompok tetap kondusif dan nyaman", B: "Memberi nilai rendah kepada mahasiswa tersebut sebagai sanksi atas sikapnya", D: "Memindahkan teman yang berbeda mazhab ke kelompok lain yang lebih sesuai" });
  opsi("SKB-MOD-004", { A: "Melarang semua tradisi lokal dalam kegiatan kampus agar tidak menimbulkan konflik antarkelompok", C: "Membiarkan kedua kelompok berselisih karena perbedaan pandangan keagamaan adalah hal yang wajar", D: "Menghukum kelompok yang menolak tradisi agar tidak lagi menyampaikan pandangannya di kampus" });
  opsi("SKB-ETK-030", { A: "Menambah angka kredit dosen sebagai syarat kenaikan jabatan akademik", C: "Memenuhi syarat administrasi kampus dan laporan kinerja tahunan", E: "Mempromosikan perguruan tinggi agar menarik lebih banyak mahasiswa" });
  opsi("SKB-ETK-031", { A: "Mengajar dengan bahan ajar dari buku teks tanpa kaitan dengan riset dosen", C: "Melakukan pengabdian kepada masyarakat yang tidak terkait dengan bidang ilmu dosen", D: "Meneliti secara mandiri tanpa melibatkan mahasiswa maupun mitra masyarakat" });
  opsi("SKB-ETK-033", { A: "Menerima karena masa bimbingan sudah selesai sehingga tidak ada lagi konflik kepentingan", C: "Menerima separuh biaya perjalanan agar tidak menyinggung perasaan mahasiswa", E: "Menerima lalu melaporkannya kepada unit pengendalian gratifikasi setahun kemudian" });
  opsi("SKB-ETK-035", { A: "Menyarankan mahasiswa melupakan kejadian itu agar fokus menyelesaikan studinya", C: "Menegur dosen tersebut sendiri secara langsung tanpa melibatkan satuan tugas kampus", E: "Meminta bukti tertulis terlebih dahulu sebelum bersedia mendengarkan cerita mahasiswa" });
  opsi("SKB-ETK-039", { A: "Ditemukan salah ketik kecil pada nama penulis atau daftar pustaka", C: "Penulis ingin menambahkan beberapa referensi baru setelah artikel terbit", E: "Artikel jarang dikutip oleh peneliti lain dalam beberapa tahun terakhir" });
  opsi("SKB-ETK-041", { A: "Mempercepat proses publikasi hasil penelitian di jurnal bereputasi", C: "Menilai tata bahasa dan format penulisan proposal penelitian", D: "Menentukan besaran dana yang layak diberikan kepada peneliti" });
  opsi("SKB-ETK-043", { B: "Kehadiran, tugas terstruktur, dan nilai ujian tengah serta akhir semester", D: "Nilai mata kuliah, indeks prestasi kumulatif, dan predikat kelulusan", E: "Penguasaan teori di kelas dan keterampilan praktikum di laboratorium" });
  opsi("SKB-ETK-045", { A: "Jumlah mata kuliah pilihan yang ditawarkan kepada mahasiswa", C: "Jumlah dosen bergelar doktor dan profesor di program studi", D: "Kelengkapan sarana gedung, laboratorium, dan ruang kuliah" });
  opsi("SKB-ETK-046", { A: "Menyembunyikan kriteria penilaian agar mahasiswa belajar lebih giat", C: "Mengurangi beban mengajar dosen dalam memeriksa tugas mahasiswa", D: "Menggantikan umpan balik tertulis dari dosen kepada mahasiswa" });
  opsi("SKB-ETK-047", { A: "Tatap muka di kelas saja sesuai jumlah jam yang tercantum di jadwal", C: "Praktikum dan seminar saja yang dilaksanakan di luar kelas", D: "Ujian tengah semester dan ujian akhir semester beserta remedial" });
  opsi("SKB-ETK-049", { A: "Menurunkan standar agar lebih mudah dicapai pada tahun-tahun berikutnya", C: "Menghentikan evaluasi karena standar sudah tercapai secara konsisten", D: "Mengganti seluruh dosen pengampu agar terjadi penyegaran program studi" });
  opsi("SKB-ETK-050", { A: "Memperbanyak dokumen mutu sebagai bukti untuk keperluan akreditasi", C: "Memberi sanksi kepada dosen yang tidak memenuhi target kinerja", E: "Mengurangi jumlah mahasiswa agar rasio dosen dan mahasiswa ideal" });
  opsi("SKB-ETK-051", { A: "Mengumpulkan sumbangan dana dari alumni untuk pembangunan kampus", C: "Mencari calon dosen baru dari kalangan alumni yang berprestasi", D: "Menentukan besaran uang kuliah tunggal bagi mahasiswa baru" });
  opsi("SKB-ETK-053", { B: "Mencari dan merekrut calon mahasiswa baru untuk memenuhi kuota penerimaan program studi setiap tahun", C: "Mengelola keuangan kampus dan menyusun laporan pertanggungjawaban anggaran fakultas", D: "Menjadi pejabat struktural di tingkat program studi, fakultas, atau universitas" });
  opsi("SKB-ETK-055", { A: "Usia dan masa kerja dosen saja, tanpa memperhatikan karya ilmiah", C: "Kedekatan dengan pimpinan dan rekomendasi dari pejabat fakultas", E: "Lama dosen menjabat sebagai pejabat struktural di kampus" });
  opsi("SKB-ETK-057", { A: "Keduanya sama karena sama-sama ditetapkan melalui surat keputusan rektor", C: "Tugas tambahan seperti dekan lebih tinggi kedudukannya daripada jabatan Profesor", D: "Jabatan akademik dipilih melalui pemilihan oleh senat, sedangkan tugas tambahan diangkat oleh menteri" });
  opsi("SKB-ETK-059", { A: "Menentukan kelulusan akhir mahasiswa pada mata kuliah tersebut", C: "Menyeleksi calon mahasiswa baru yang akan diterima program studi", D: "Menentukan peringkat kinerja dosen dalam evaluasi tahunan" });
  opsi("SKB-ETK-060", { A: "Menghafal definisi dan istilah penting dalam bahan ajar", C: "Menyalin catatan dosen secara lengkap dan rapi", D: "Mengerjakan soal pilihan ganda dengan cepat dan tepat" });
  opsi("SKB-ETK-061", { A: "Membacakan slide materi secara lengkap selama dua jam agar tidak ada yang terlewat", C: "Mematikan kamera dan mikrofon semua mahasiswa agar kuliah tidak terganggu", D: "Mengirim materi lewat LMS tanpa sesi interaksi agar mahasiswa belajar mandiri" });
  opsi("SKB-ETK-062", { A: "Kebijakan pribadi dosen pembimbing akademik masing-masing mahasiswa", C: "Persetujuan orang tua atau wali mahasiswa secara tertulis", E: "Jumlah jam kehadiran mahasiswa di tempat kegiatan saja" });
  opsi("SKB-ETK-063", { A: "Melepas mahasiswa sepenuhnya kepada industri selama masa magang berlangsung", C: "Mencarikan pekerjaan tetap bagi mahasiswa di perusahaan tempat magang", D: "Menggantikan peran pembimbing lapangan dalam memberi tugas harian" });
  opsi("SKB-ETK-066", { A: "Keinginan dan minat pribadi dosen pelaksana kegiatan semata", C: "Lokasi yang paling dekat dari kampus agar biaya perjalanan hemat", D: "Ketersediaan dana hibah meskipun belum ada perencanaan kegiatan" });
  opsi("SKB-ETK-067", { A: "Diam karena perubahan nilai itu terjadi pada mata kuliah dosen lain", C: "Mengubah nilai mahasiswa lain yang setara agar perlakuannya adil", D: "Menyebarkan informasi perubahan nilai itu kepada para mahasiswa" });
  opsi("SKB-ETK-068", { A: "Tidak perlu batasan apa pun karena sains terbuka mengutamakan keterbukaan", C: "Hanya kepentingan peneliti sebagai pemilik data penelitian", D: "Keinginan penerbit jurnal tempat artikel akan diterbitkan" });
  opsi("SKB-ETK-069", { A: "Menentukan nilai akhir mahasiswa sejak pertemuan pertama perkuliahan", C: "Menggantikan RPS sebagai dokumen perencanaan pembelajaran resmi", D: "Membatasi jumlah pertanyaan yang boleh diajukan mahasiswa di kelas" });
  opsi("SKB-ETK-070", { A: "Kebebasan akademik dosen dalam menyampaikan materi kuliah", C: "Prinsip otonomi keilmuan perguruan tinggi", D: "Hak cipta dosen atas soal ujian yang ia susun" });
  opsi("SKB-ETK-071", { A: "Memperpanjang tulisan agar memenuhi jumlah halaman minimal", C: "Menghindari pemeriksaan kemiripan oleh perangkat lunak plagiarisme", D: "Mengesankan pembaca dengan banyaknya sumber yang dikutip" });
  opsi("SKB-ETK-072", { A: "Menyimpan laporan hasil penelitian di perpustakaan dan repositori kampus", C: "Menerbitkan hasil penelitian di jurnal ilmiah tanpa tindak lanjut lain", D: "Menghentikan penelitian dasar dan hanya membiayai penelitian terapan" });
  opsi("SKB-ETK-073", { B: "Menentukan jabatan akademik dan angka kredit setiap dosen secara individual", C: "Menetapkan besaran uang kuliah mahasiswa berdasarkan kemampuan ekonomi", D: "Memilih rektor dan pimpinan perguruan tinggi untuk periode berikutnya" });
  opsi("SKB-ETK-074", { A: "Memberi nilai yang sama untuk semua anggota berdasarkan hasil akhir proyek", C: "Menilai seluruh anggota berdasarkan kinerja ketua kelompok saja", D: "Menilai dari kehadiran setiap anggota dalam pertemuan kelompok" });

  /* ---------- 2) Rujukan untuk soal bermuatan hukum/sejarah ketatanegaraan ---------- */
  rujukan("TWK-PIL-004", "Risalah Sidang BPUPKI dan PPKI (Sekretariat Negara RI); Piagam Jakarta, 22 Juni 1945");
  rujukan("TWK-PIL-005", "Risalah Sidang PPKI 18 Agustus 1945; Pembukaan UUD NRI 1945 alinea IV");
  rujukan("TWK-PIL-007", "UUD NRI 1945 beserta Perubahan Pertama s.d. Keempat (1999–2002)");
  rujukan("TWK-BEL-008", "UU No. 3 Tahun 2002 tentang Pertahanan Negara");
  rujukan("SKB-MDB-017", "UUD NRI 1945; Kemenag RI, Moderasi Beragama (2019) — indikator komitmen kebangsaan");
  rujukan("SKB-MDB-020", "UUD NRI 1945; Pancasila; Kemenag RI, Moderasi Beragama (2019)");
  rujukan("SKB-MOD-003", "Kementerian Agama RI, Moderasi Beragama (Badan Litbang dan Diklat, 2019) — perlu verifikasi edisi terbaru");
})();
