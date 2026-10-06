# 📘 Buku Panduan Pengguna & Pemilik Website (User Guide Terkini)
## ARSI KARYA — Kontraktor & Design Build
**Website Resmi:** [https://arsikarya.id](https://arsikarya.id)  
**Dokumen:** Panduan Operasional Lengkap, Manajemen Konten (CMS), Manajemen Leads, Akun Sistem & Strategi SEO  
**Target Pembaca:** Pemilik Bisnis, Manajer Operasional & Staf Pengelola Konten (Non-Programmer)  
**Versi Dokumen:** 2.2 (Update Sistem Terbaru 2026)

---

## 📑 Daftar Isi
1. [Daftar Akun Akses Utama & Ekosistem Website](#1-daftar-akun-akses-utama--ekosistem-website)
2. [Fungsi 5 Layanan Pendukung & Hal Penting yang Perlu Diketahui](#2-fungsi-5-layanan-pendukung--hal-penting-yang-perlu-diketahui)
3. [Panduan Masuk & Keamanan Halaman Admin (CMS)](#3-panduan-masuk--keamanan-halaman-admin-cms)
4. [Panduan Lengkap Pengelolaan Fitur Admin (Menu per Menu)](#4-panduan-lengkap-pengelolaan-fitur-admin-menu-per-menu)
   - [A. Dashboard Operasional & Log Aktivitas](#a-dashboard-operasional--log-aktivitas)
   - [B. Kelola Konten Halaman Publik (Beranda, Profil, Kontak)](#b-kelola-konten-halaman-publik-beranda-profil-kontak)
   - [C. Portofolio Proyek & Galeri Pekerjaan](#c-portofolio-proyek--galeri-pekerjaan)
   - [D. Spesialisasi Layanan & Tanya-Jawab (FAQ)](#d-spesialisasi-layanan--tanya-jawab-faq)
   - [E. Artikel Blog & Edukasi (Senjata Utama SEO)](#e-artikel-blog--edukasi-senjata-utama-seo)
   - [F. Testimoni Kepuasan Klien](#f-testimoni-kepuasan-klien)
   - [G. Manajemen Pengajuan Kerja Sama / Leads Konsultasi](#g-manajemen-pengajuan-kerja-sama--leads-konsultasi)
   - [H. Media Library Pintar & Cloud Storage](#h-media-library-pintar--cloud-storage)
   - [I. Pengaturan Umum Website, Kontak WhatsApp & Statistik](#i-pengaturan-umum-website-kontak-whatsapp--statistik)
   - [J. Manajemen Pengguna & Hak Akses Staf Admin](#j-manajemen-pengguna--hak-akses-staf-admin)
   - [K. Asisten Virtual / Chatbot AI Konsultasi](#k-asisten-virtual--chatbot-ai-konsultasi)
5. [Strategi Praktis Meningkatkan Ranking Google (SEO Masterplan)](#5-strategi-praktis-meningkatkan-ranking-google-seo-masterplan)
6. [Kalender Perawatan Rutin & Standar Operasional Prosedur (SOP)](#6-kalender-perawatan-rutin--standar-operasional-prosedur-sop)
7. [Tanya Jawab & Solusi Masalah Umum (Troubleshooting FAQ)](#7-tanya-jawab--solusi-masalah-umum-troubleshooting-faq)

---

## 1. Daftar Akun Akses Utama & Ekosistem Website

Website Arsi Karya dibangun dengan arsitektur modern berkecepatan tinggi, hemat daya server, dan berstandar keamanan tinggi. Seluruh platform pendukung telah dihubungkan ke **satu akun Google induk (Single Sign-On)** agar mudah dikelola dan aman.

| No | Layanan / Platform | Tautan / Link Login | Akun / Email Akses | Kata Sandi (Password) / Cara Masuk |
|:---:|:---|:---|:---|:---|
| **1** | **Google Account (Gmail)** | [mail.google.com](https://mail.google.com) | `webarsikarya@gmail.com` | `Bandung@123` |
| **2** | **DomaiNesia (Domain)** | [login.domainesia.com](https://login.domainesia.com) | `webarsikarya@gmail.com` | Klik tombol **"Log In with Google"** |
| **3** | **Cloudinary (Gudang Foto)** | [cloudinary.com/users/login](https://cloudinary.com/users/login) | `webarsikarya@gmail.com` | Klik tombol **"Sign In with Google"** |
| **4** | **Vercel (Hosting Server)** | [vercel.com/login](https://vercel.com/login) | `webarsikarya@gmail.com` | Klik tombol **"Continue with Google"** |
| **5** | **Neon DB (Database Cloud)** | [console.neon.tech/login](https://console.neon.tech/login) | `webarsikarya@gmail.com` | Klik tombol **"Continue with Google"** |
| **6** | **Admin Website (CMS)** | [arsikarya.id/admin/login](https://arsikarya.id/admin/login) | `webarsikarya@gmail.com` | `Bandung@123` *(atau password admin Anda)* |

> 💡 **Tips Praktis Satu Pintu:** Cukup buka peramban Google Chrome di laptop atau komputer kerja Anda, lalu login ke akun Gmail `webarsikarya@gmail.com`. Setelah sesi Google aktif, Anda dapat membuka DomaiNesia, Cloudinary, Vercel, maupun Neon DB cukup dengan sekali klik **"Continue with Google"** tanpa perlu mengetik ulang password.

---

## 2. Fungsi 5 Layanan Pendukung & Hal Penting yang Perlu Diketahui

Agar mudah dipahami oleh pemilik bisnis dan staf non-programmer, bayangkan struktur website seperti membangun sebuah **Gedung Kantor Perusahaan**:

```
+---------------------------------------------------------------------------------+
| DOMAINESIA : Papan Nama & Alamat Jalan Resmi Gedung (arsikarya.id)              |
+---------------------------------------------------------------------------------+
| VERCEL     : Bangunan Fisik, Mesin & Listrik Gedung (Hosting 24 Jam Nonstop)    |
+---------------------------------------------------------------------------------+
| NEON DB    : Lemari Arsip Berkas Digital (Database teks artikel, proyek, leads) |
+---------------------------------------------------------------------------------+
| CLOUDINARY : Galeri & Gudang Khusus Foto Resolusi Tinggi (Optimasi Otomatis)    |
+---------------------------------------------------------------------------------+
| GMAIL      : Resepsionis & Kunci Master (Notifikasi surat masuk calon klien)    |
+---------------------------------------------------------------------------------+
```

### A. Gmail (`webarsikarya@gmail.com`)
* **Ibarat:** Resepsionis & Kunci Master Seluruh Akun.
* **Fungsi Utama:**
  1. Menjadi akun induk (*Single Sign-On*) untuk login ke semua platform lainnya.
  2. Menerima pemberitahuan email otomatis setiap kali ada calon klien yang mengisi formulir konsultasi kerja sama di website.
  3. Menjadi email pemulihan sandi jika staf admin sewaktu-waktu lupa kata sandi.
* **Hal Penting yang Perlu Dilakukan:**
  * Periksa kotak masuk secara berkala untuk memantau calon klien baru.
  * Pastikan nomor HP pemulihan pada akun Google selalu terhubung ke nomor pemilik atau penanggung jawab resmi perusahaan.

---

### B. DomaiNesia
* **Ibarat:** Sertifikat Papan Nama Jalan Resmi (`arsikarya.id`).
* **Fungsi Utama:**
  1. Tempat pendaftaran dan kepemilikan nama domain resmi Arsi Karya.
  2. Mengarahkan nama domain ke server hosting (DNS Management).
* **Hal Penting yang Perlu Dilakukan:**
  * **Perpanjangan Tahunan (Sangat Penting):** Nama domain disewa dengan masa aktif 1 tahun sekali. Pastikan membayar tagihan perpanjangan sebelum jatuh tempo agar alamat website tidak mati. DomaiNesia akan mengirimkan pengingat tagihan ke email `webarsikarya@gmail.com`.
  * Pengaturan DNS teknis **tidak perlu diubah** kecuali atas instruksi pengembang sistem.

---

### C. Cloudinary
* **Ibarat:** Gudang Khusus Penyimpanan Foto & Galeri Portofolio.
* **Fungsi Utama:**
  1. Menyimpan seluruh aset visual: foto proyek pengerjaan, gambar artikel, sertifikat lisensi, dan logo perusahaan.
  2. Mengompres foto resolusi tinggi secara otomatis menjadi format modern (WebP/AVIF) tanpa menurunkan ketajaman visual, sehingga website dibuka super cepat di HP maupun laptop klien.
* **Hal Penting yang Perlu Dilakukan:**
  * Di halaman admin website sudah tersedia tombol upload Cloudinary otomatis, sehingga Anda jarang perlu membuka dashboard Cloudinary secara langsung.
  * Masuk ke dashboard Cloudinary jika ingin melihat penggunaan kapasitas media atau mengunduh arsip foto secara massal.

---

### D. Vercel
* **Ibarat:** Pondasi Fisik Bangunan & Jaringan Listrik Gedung (Cloud Hosting).
* **Fungsi Utama:**
  1. Menampilkan website secara online 24 jam nonstop ke seluruh dunia dengan kecepatan tinggi (*Edge Network CDN*).
  2. Menyediakan sertifikat keamanan resmi (*SSL / HTTPS / Gembok Hijau*) secara otomatis agar pengunjung merasa aman dan reputasi website di mata Google terjaga.
  3. Memantau statistik trafik pengunjung secara langsung (*Vercel Analytics*).
* **Hal Penting yang Perlu Dilakukan:**
  * Memantau status website agar selalu berstatus **Ready (Online)**.
  * Anda tidak perlu menyentuh atau mengubah kodingan di dalam platform ini.

---

### E. Neon DB
* **Ibarat:** Lemari Berkas Digital Tempat Menyimpan Semua Data Tertulis.
* **Fungsi Utama:**
  1. Menyimpan data dinamis: teks artikel berita/blog, portofolio proyek, daftar layanan, review testimoni klien, data leads pengajuan kerja sama, dan akun staf pengelola.
  2. Melakukan pencadangan (*backup*) berkala secara otomatis di cloud demi keamanan data.
* **Hal Penting yang Perlu Dilakukan:**
  * **Hampir tidak pernah perlu disentuh langsung!** Seluruh isi database sudah terhubung ke Dashboard Admin website Arsi Karya yang jauh lebih mudah dioperasikan.
  * Simpan akses ini sebagai bukti kepemilikan aset database perusahaan.

---

## 3. Panduan Masuk & Keamanan Halaman Admin (CMS)

Halaman Admin adalah ruang kerja utama Anda untuk mengelola seluruh konten website tanpa perlu menyentuh kode pemrograman sedikit pun.

### Langkah Masuk (Login):
1. Buka browser (Google Chrome, Safari, atau Microsoft Edge).
2. Kunjungi alamat: **`https://arsikarya.id/admin/login`**
3. Masukkan data:
   * **Email:** `webarsikarya@gmail.com`
   * **Password:** `Bandung@123` *(atau password akun admin Anda)*
4. Klik tombol **Masuk / Login**. Anda akan langsung diarahkan ke Dashboard Operasional.

### Fitur Lupa Kata Sandi:
* Jika lupa password, klik tulisan **"Lupa kata sandi?"** di bawah tombol login.
* Masukkan email admin Anda, sistem akan secara otomatis mengirimkan tautan reset password ke kotak masuk Gmail `webarsikarya@gmail.com`.

### Keamanan Akun:
* Jika bekerja menggunakan komputer atau laptop kantor bersama, biasakan untuk selalu mengklik tombol **Logout** di menu paling bawah sidebar setelah selesai mengedit konten.

---

## 4. Panduan Lengkap Pengelolaan Fitur Admin (Menu per Menu)

Struktur menu di sidebar admin disusun rapi sesuai alur operasional:

```
+-----------------------------------------------------------------------+
| PANEL KONTROL ARSI KARYA CMS                                          |
+-----------------------------------------------------------------------+
| 📊 Dashboard            : Ringkasan data operasional & log aktivitas  |
| --- KONTEN ---                                                        |
| 🌐 Semua Konten (Hub)   : Pusat navigasi pengeditan halaman publik    |
| 📁 Proyek               : Portofolio, kategori & galeri dokumentasi   |
| 🛠️ Layanan              : Spesialisasi kerja & daftar tanya-jawab FAQ |
| 📝 Artikel              : Edukasi, tips bangunan, & pengaturan SEO    |
| ⭐ Testimoni            : Review kepuasan klien & foto proyek selesai |
| --- LEADS ---                                                         |
| 📬 Pengajuan Kerja Sama : Daftar kontak calon klien & follow-up WA    |
| --- MEDIA ---                                                         |
| 🖼️ Media Library        : Manajemen foto & deteksi gambar terpakai    |
| --- PENGGUNA ---                                                      |
| 👥 Kelola Users         : Tambah staf admin & manajemen password      |
| --- WEBSITE ---                                                       |
| ⚙️ Pengaturan           : Nomor WhatsApp floating, alamat, logo & SEO |
+-----------------------------------------------------------------------+
```

---

### A. Dashboard Operasional & Log Aktivitas
* **Fungsi:** Menyajikan ringkasan kondisi website secara *real-time*.
* **Informasi yang Ditampilkan:**
  1. **Kartu Metrik Utama:**
     * Total Proyek (Berapa yang sudah Terbit vs masih Draft).
     * Total Artikel Blog (Terbit vs Draft).
     * Total Testimoni Klien.
     * Total Pengajuan Kerja Sama Masuk (Leads Baru, Ditinjau, Selesai).
  2. **Pintasan Aksi Cepat (*Quick Actions*):** Tombol langsung **+ Tambah Proyek** dan **+ Tulis Artikel**.
  3. **Tabel Pengajuan Kerja Sama Terbaru:** Melihat data kontak calon klien terbaru yang baru saja mengisi formulir di website.
  4. **Log Aktivitas Admin (*Audit Trail*):** Mengetahui siapa staf yang baru saja menambah, mengedit, atau menghapus artikel/proyek beserta tanggal dan jamnya.

---

### B. Kelola Konten Halaman Publik (Beranda, Profil, Kontak)
Akses melalui menu **Semua Konten**:

#### 1. Halaman Beranda (Home)
* **Yang Bisa Diedit:**
  * Foto Banner Atas (*Hero Image*).
  * Kalimat Headline Utama (Contoh: *"Mitra Kontraktor & Design Build Terpercaya di Bandung, Jawa — Bali"*).
  * Teks & Tautan Tombol Aksi (*Call To Action / CTA*).
  * Tautan Media Sosial (Instagram, LinkedIn, dll.).
* **Cara Mengubah:**
  1. Klik menu **Semua Konten** -> pilih **Halaman Utama (Home)**.
  2. Ubah kalimat headline pada kolom teks.
  3. Klik tombol **Upload Baru** untuk mengganti foto banner.
  4. Klik tombol **Simpan Perubahan** di bagian bawah.

#### 2. Profil Perusahaan (Tentang Kami / About Us)
* **Yang Bisa Diedit:**
  * Narasi profil Arsi Karya, filosofi kerja, dan visi misi.
  * Daftar lisensi resmi, izin konstruksi, atau sertifikat mutu.
  * Galeri foto aktivitas tim kerja dan dokumentasi workshop.
* **Cara Mengubah:**
  1. Buka **Semua Konten** -> pilih **Tentang Kami (About)**.
  2. Perbarui deskripsi narasi.
  3. Untuk sertifikat baru, klik **+ Tambah Sertifikasi**, ketik nama sertifikat dan unggah fotonya.
  4. Klik **Simpan Perubahan**.

#### 3. Kontak & Lokasi Kantor (Contact)
* **Yang Bisa Diedit:** Alamat kantor fisik Arsi Karya di Bandung, nomor telepon kantor, nomor WhatsApp, email resmi, dan sematan peta Google Maps.
* **Cara Mengubah:** Buka **Semua Konten** -> pilih **Kontak & Lokasi**, ubah data kontak jika ada pembaruan, lalu klik **Simpan**.

---

### C. Portofolio Proyek & Galeri Pekerjaan
Halaman portofolio adalah alat pembuktian kredibilitas Arsi Karya di hadapan calon klien.

* **Fitur yang Tersedia:**
  * Filter proyek berdasarkan kategori: *Konstruksi*, *Design & Build*, *Fabrikasi*, *Pengadaan Barang*, *Interior*, dan *Renovasi*.
  * Pencarian cepat berdasarkan judul atau lokasi proyek.
  * Pilihan status: **Publikasikan** (langsung tayang di website) atau **Draft** (disimpan sementara).
* **Kolom Isian pada Form Proyek:**
  * **Judul Proyek:** (Contoh: *"Pembangunan Villa Tropis Modern Lembang"*).
  * **Kategori & Tahun:** Menentukan kelompok pengerjaan dan tahun pelaksanaan.
  * **Lokasi:** (Contoh: *"Bandung Utara, Jawa Barat"*).
  * **Klien / Konteks:** Nama pemilik atau perusahaan (bisa diisi *Private Residence*).
  * **Peran Arsi Karya:** (Contoh: *"Main Contractor & Interior Fabrication"*).
  * **Deskripsi Lengkap, Lingkup Kerja (*Scope*), dan Proses Pengerjaan:** Penjelasan detail tahapan pekerjaan.
  * **Foto Sampul (*Cover Image*):** Foto terbaik yang menjadi thumbnail utama proyek.
  * **Galeri Foto Proyek:** Unggah puluhan foto dokumentasi ruangan, struktur, dan hasil akhir. Anda dapat mengatur urutan tampilan foto menggunakan tombol panah naik/turun dan mengisi *Alt Text* foto untuk kebutuhan SEO.
  * **SEO Metadata Khusus Proyek:** Kolom SEO Title dan SEO Description agar halaman proyek ini mudah muncul saat orang mencari inspirasi desain di Google.
* **Langkah Menambah Proyek Baru:**
  1. Buka menu **Proyek** -> klik tombol **+ Tambah Proyek Baru**.
  2. Isi Judul, Kategori, Lokasi, dan Tahun.
  3. Tulis deskripsi pengerjaan proyek.
  4. Upload Foto Sampul dan tambahkan foto-foto galeri detail.
  5. Pastikan status **Publikasikan** dicentang -> klik **Simpan Proyek**.

---

### D. Spesialisasi Layanan & Tanya-Jawab (FAQ)
* **Yang Bisa Diedit:**
  * Judul dan ringkasan layanan utama (Konstruksi, Design & Build, Fabrikasi, Pengadaan Barang).
  * Deskripsi mendalam mengenai standar kualitas kerja Arsi Karya.
  * Foto header layanan.
  * **Daftar Pertanyaan yang Sering Diajukan (*Interactive FAQ*):** Memberikan jawaban langsung atas keraguan umum calon klien (misal: cara pembayaran termin, garansi pemeliharaan, sistem kontrak borongan).
* **Cara Mengubah:**
  1. Klik menu **Layanan**.
  2. Klik ikon **Pensil (Edit)** pada layanan yang ingin diubah.
  3. Perbarui penjelasan atau klik tombol **+ Tambah FAQ** untuk menambahkan tanya-jawab baru.
  4. Klik **Simpan Layanan**.

---

### E. Artikel Blog & Edukasi (Senjata Utama SEO)
Artikel blog adalah sarana terpenting untuk mendatangkan ribuan pengunjung organik dari Google setiap bulan tanpa membayar biaya iklan sepeser pun.

* **Fitur yang Tersedia:**
  * **Kategori Terstruktur:** *Layanan*, *Renovasi*, *Material*, *Desain*, *Konstruksi*, *Budget & Perencanaan*, *Project Story*, dan *Tips*.
  * **Editor Visual (WYSIWYG):** Menulis teks tebal, miring, poin nomor/titik, menyisipkan kutipan, link tautan, dan gambar pendukung secara langsung layaknya mengetik di Microsoft Word.
  * **Cover Image:** Foto utama artikel berkualitas tinggi dari Cloudinary.
  * **Slug Otomatis:** Sistem secara otomatis membuat link URL yang rapi dari judul artikel Anda.
  * **Kotak Metadata SEO:** Kolom SEO Title dan SEO Description yang terpisah untuk mengontrol tampilan di hasil pencarian Google.
* **Langkah Menerbitkan Artikel Baru:**
  1. Klik menu **Artikel** -> klik tombol **+ Tulis Artikel Baru**.
  2. Ketik **Judul Artikel** (contoh: *"Estimasi Biaya Bangun Rumah 2 Lantai di Bandung 2026"*).
  3. Pilih Kategori yang relevan.
  4. Upload **Gambar Sampul** artikel.
  5. Tulis isi artikel pada kolom editor visual secara rapi dengan sub-judul.
  6. Lengkapi kotak **Pengaturan SEO Metadata** di sebelah kanan.
  7. Centang status **Publikasikan** -> klik **Terbitkan Artikel**.

---

### F. Testimoni Kepuasan Klien
* **Fungsi:** Menampilkan ulasan positif dari pemilik proyek sebelumnya untuk meyakinkan calon klien baru (*Social Proof*).
* **Yang Bisa Diedit:**
  * Nama Klien / Pemilik Rumah / Pejabat Perusahaan.
  * Profesi / Nama Perusahaan Klien.
  * Nama Proyek yang Dikerjakan.
  * Isi Kutipan Testimoni.
  * Foto Profil Klien atau Foto Bangunan yang selesai.
* **Cara Mengelola:**
  1. Buka menu **Testimoni**.
  2. Klik tombol **+ Tambah Testimoni**.
  3. Masukkan nama dan ulasan klien.
  4. Centang opsi **Tampilkan di Website** -> klik **Simpan**.

---

### G. Manajemen Pengajuan Kerja Sama / Leads Konsultasi
Setiap pengunjung yang mengisi formulir konsultasi atau penawaran di website akan langsung tercatat di menu ini.

* **Data yang Terekam dari Calon Klien:**
  * Nama Lengkap & Perusahaan.
  * Nomor WhatsApp & Alamat Email.
  * Jenis Layanan yang Dibutuhkan.
  * Estimasi Anggaran Proyek (*Budget*).
  * Lokasi Rencana Pengerjaan.
  * Pesan / Catatan Kebutuhan Bangunan.
* **Fitur Cepat:**
  * **Tombol Chat WhatsApp Sekali Klik:** Sistem menyediakan tombol WhatsApp yang langsung membuka aplikasi WA dengan pesan pembuka otomatis:  
    `"Halo Bpk/Ibu [Nama], terima kasih telah menghubungi Arsi Karya..."`  
    Anda tidak perlu lagi mengetik atau menyimpan nomor secara manual di kontak HP!
  * **Tombol Salin Nomor WhatsApp:** Sekali klik untuk menyalin nomor calon klien.
  * **5 Tahap Status Pengajuan (*Leads Pipeline*):**
    1. **Baru (*New*):** Formulir baru masuk, belum diproses.
    2. **Ditinjau (*Reviewing*):** Tim teknis sedang membaca kebutuhan & menghitung estimasi.
    3. **Sudah Dihubungi (*Contacted*):** Calon klien sudah disapa via WhatsApp / telepon.
    4. **Qualified (*Prospek Kuat*):** Klien berminat serius dan masuk tahap survei lokasi / RAB.
    5. **Selesai (*Closed*):** Kerja sama deal disepakati atau pengajuan selesai diproses.

---

### H. Media Library Pintar & Cloud Storage
* **Fungsi:** Mengelola seluruh aset visual perusahaan yang tersimpan di cloud.
* **Fitur Cerdas yang Tersedia:**
  * **Filter Status Penggunaan:** Anda dapat menyortir gambar menjadi: *Semua Gambar*, *Sedang Digunakan (In Use)*, dan *Tidak Terpakai (Unused)*.
  * **Peringatan Aman Anti-Salah-Hapus:** Jika Anda mencoba menghapus foto yang sedang dipakai di halaman proyek atau artikel tertentu, sistem akan memberi tahu nama proyek/artikel tersebut sehingga Anda tidak akan merusak tampilan website secara tidak sengaja.
  * **Tombol Salin URL Gambar:** Menyalin link gambar berkecepatan tinggi jika ingin Anda kirimkan ke klien di dokumen terpisah.
  * **Tombol Sinkronisasi Cloudinary:** Menarik dan menyamakan foto baru yang diunggah langsung ke web Cloudinary.

---

### I. Pengaturan Umum Website, Kontak WhatsApp & Statistik
Menu ini mengontrol data identitas utama yang tampil di seluruh penjuru website.

* **Yang Bisa Diatur:**
  * **Nomor WhatsApp Utama:** Nomor yang langsung terhubung saat pengunjung mengklik tombol WhatsApp mengapung di pojok kanan bawah website.
  * **Template Salam WhatsApp Otomatis:** Kalimat pembuka default saat klien mengklik chat WA (Contoh: *"Halo Arsi Karya, saya ingin berkonsultasi terkait kebutuhan proyek saya..."*).
  * **Nomor Telepon Kantor & Email Resmi.**
  * **Alamat Lengkap Kantor Bandung:** (Bumi Adipura, Gedebage, Bandung).
  * **Angka Pencapaian Prestasi (*Dynamic Statistics*):** Mengubah angka yang tampil di Beranda & Tentang Kami:
    * Statistik 1: Nilai (misal: `100+`) & Label (`PROYEK SELESAI`)
    * Statistik 2: Nilai (misal: `100%`) & Label (`KOMITMEN MUTU`)
    * Statistik 3: Nilai (misal: `4`) & Label (`LAYANAN SPESIALIS`)
  * **Logo Perusahaan & Favicon:** Gambar identitas brand di navigasi dan tab browser.
  * **SEO Default Website:** Judul dan deskripsi meta utama saat domain `arsikarya.id` dibagikan di media sosial atau WhatsApp.
* **Cara Mengubah:**
  1. Klik menu **Pengaturan** di paling bawah sidebar.
  2. Ubah data kontak atau nomor WhatsApp yang diinginkan.
  3. Klik tombol **Simpan Pengaturan**. Perubahan langsung aktif seketika di website publik!

---

### J. Manajemen Pengguna & Hak Akses Staf Admin
Khusus akun berstatus *Super Admin*, menu ini memungkinkan Anda mengelola tim internal yang bertugas mengisi konten website.

* **Tingkatan Hak Akses (*Role*):**
  * **Super Admin:** Memiliki seluruh hak akses penuh, termasuk menambah staf baru dan mengatur konfigurasi website.
  * **Admin:** Staf operasional yang dapat menambah/mengedit proyek, artikel, testimoni, dan membalas leads kerja sama.
* **Fitur Manajemen Pengguna:**
  * **Tambah Akun Staf Baru:** Masukkan nama staf, email, dan kata sandi sementara. Anda tidak perlu membagikan email utama `webarsikarya@gmail.com` kepada karyawan.
  * **Reset Kata Sandi Staf:** Mengganti password staf jika yang bersangkutan lupa sandi.
  * **Nonaktifkan Akun Staf:** Jika ada staf yang sudah tidak bekerja lagi di Arsi Karya, cukup ubah statusnya menjadi *Non-aktif*. Seluruh artikel dan proyek yang pernah mereka buat tetap aman di website!

---

### K. Asisten Virtual / Chatbot AI Konsultasi
Website Arsi Karya telah dilengkapi fitur asisten AI pintar yang siap menjawab pertanyaan awal calon klien selama 24 jam nonstop mengenai layanan, estimasi alur pengerjaan, dan portofolio Arsi Karya sebelum diarahkan ke nomor WhatsApp tim sales.
* **Fitur di Admin:**
  * Melihat riwayat percakapan (*Chat Logs*) antara calon klien dengan AI.
  * Mempelajari pertanyaan apa saja yang paling sering diajukan pengunjung.

---

## 5. Strategi Praktis Meningkatkan Ranking Google (SEO Masterplan)

SEO (*Search Engine Optimization*) adalah proses menjadikan website **arsikarya.id** muncul di peringkat 1 Google secara alami tanpa membayar biaya iklan saat orang mengetik pencarian seperti:
* *"kontraktor rumah bandung"*
* *"jasa renovasi rumah minimalis bandung"*
* *"estimasi biaya bangun rumah 2026"*
* *"kontraktor design and build bandung"*

---

### 🎯 5 Langkah Emas SEO untuk Tim Arsi Karya:

#### 1. Rutin Menerbitkan Artikel Blog Edukatif (1–2 Kali Seminggu)
Google memprioritaskan website yang aktif dan konsisten membagikan informasi bermanfaat bagi pembaca.
* **Topik Artikel yang Paling Banyak Dicari Calon Klien:**
  * **Seputar Biaya & Anggaran:** *"Rincian Biaya Bangun Rumah 2 Lantai Minimalis di Bandung Tahun 2026"*, *"Estimasi RAB Renovasi Dapur Modern Hemat Biaya"*.
  * **Tips Memilih Vendor:** *"7 Ciri Kontraktor Rumah Terpercaya di Bandung yang Bergaransi"*, *"Perbedaan Sistem Kerja Borongan Penuh vs Upah Tukang"*.
  * **Perbandingan Bahan Bangunan:** *"Pilih Rangka Baja Ringan atau Kayu? Simak Kelebihan & Perbandingannya"*, *"Bata Merah vs Hebel: Mana yang Lebih Kuat untuk Dinding Rumah?"*.
  * **Panduan Legalitas & Izin:** *"Syarat & Panduan Mengurus PBG (Pengganti IMB) Bangunan Rumah di Kota Bandung"*.
  * **Kisah Proyek Nyata (*Case Study*):** *"Transformasi Rumah Tua 90-an Menjadi Hunian Tropis Kontemporer di Dago"*.

#### 2. Selalu Masukkan Kata Kunci Wilayah ("Bandung" / "Jawa Barat")
Klien kontraktor selalu mencari vendor yang beroperasi di wilayah tempat tinggal mereka.
* Masukkan kata *"Bandung"*, *"Lembang"*, *"Gedebage"*, *"Cimahi"*, atau *"Jawa Barat"* pada Judul, Paragraf Pembuka, dan Paragraf Penutup artikel.
* **Formula Judul Terbaik:**  
  `[Topik / Solusi] + [Kategori Bangunan] + [Lokasi: Bandung] + [Tahun Terkini]`  
  *Contoh:* `Panduan Estimasi Biaya Bangun Rumah Tinggal di Bandung (Update 2026)`

#### 3. Panduan Mengisi Kolom SEO di Halaman Admin:
Saat membuat artikel di admin, perhatikan 3 kotak penting ini:

| Kolom di Admin | Aturan Pengisian Terbaik | Contoh Nyata yang Disukai Google |
|---|---|---|
| **Judul Artikel** | Menarik minat pembaca, memuat solusi dan wilayah. | `Estimasi Biaya Bangun Rumah di Bandung 2026 (RAB & Tips Hemat)` |
| **URL Slug** | Huruf kecil semua, pisahkan dengan tanda hubung (-), tanpa kata sambung yang tidak perlu. | `biaya-bangun-rumah-bandung-2026` |
| **SEO Title** | Judul yang muncul di halaman hasil Google (panjang ideal 50–60 karakter). Akhiri dengan nama brand Arsi Karya. | `Biaya Bangun Rumah Bandung 2026 - Arsi Karya` |
| **SEO Description** | Ringkasan isi yang menggugah orang untuk mengklik (panjang ideal 120–155 karakter). | `Ingin bangun rumah di Bandung? Simak estimasi rincian biaya borongan, pemilihan material berkualitas, dan konsultasi RAB gratis bersama Arsi Karya.` |
| **Gambar Sampul** | Foto asli proyek nyata pengerjaan Arsi Karya beresolusi tajam (bukan foto dari Google). | Foto tampak depan rumah hasil renovasi |

#### 4. Struktur Artikel yang Nyaman Dibaca & Disukai Algoritma:
* **Gunakan Sub-Judul (Heading 2 & Heading 3):** Hindari menulis paragraf panjang tanpa jeda. Pecah isi tulisan menjadi poin-poin yang mudah dipindai mata pembaca.
* **Beri Tautan ke Dalam Website Sendiri (*Internal Linking*):**
  * Sisipkan tautan ke halaman portofolio atau layanan:  
    *Contoh:* *"Anda dapat melihat contoh proyek serupa yang telah kami selesaikan di halaman [Portofolio Proyek Arsi Karya](/proyek)"* atau *"Konsultasikan denah rumah impian Anda melalui [Layanan Design & Build](/layanan)."*
  * Langkah ini membuat pengunjung betah berlama-lama membaca website Anda, yang merupakan nilai tambah besar bagi Google.
* **Tutup dengan Tombol Aksi (*Call To Action / CTA*):**
  * Selalu akhiri artikel dengan ajakan hangat:  
    *"Punya rencana renovasi atau bangun rumah impian dari nol? Hubungi tim Arsi Karya sekarang via WhatsApp untuk sesi konsultasi denah dan estimasi RAB gratis!"*

#### 5. Optimasi SEO Lokal (Sinergi dengan Google Bisnis & Google Maps):
* Pastikan Nama Perusahaan (*PT / Studio Arsi Karya*), Alamat Kantor di Gedebage, dan Nomor WhatsApp yang tertulis di website **100% sama persis** dengan yang terdaftar di profil **Google Business Profile (Google Maps)** Arsi Karya.
* Mintalah setiap klien yang puas dengan hasil pembangunan untuk memberikan review bintang 5 di Google Maps, lalu salin kutipan ulasan mereka ke menu **Testimoni** website.

---

## 6. Kalender Perawatan Rutin & Standar Operasional Prosedur (SOP)

Untuk menjaga performa website selalu prima dan menghasilkan leads pelanggan secara konsisten:

| Frekuensi Waktu | Aktivitas Pengelolaan | Penanggung Jawab |
|:---|:---|:---|
| **Setiap Hari / Real-time** | Periksa menu **Pengajuan Kerja Sama (Inquiries)** dan kotak masuk email `webarsikarya@gmail.com`. Segera sapa calon klien via WhatsApp maksimal dalam 1x24 jam untuk memaksimalkan peluang *deal*. | Tim Admin / Sales Marketing |
| **Mingguan (1–2x)** | Tulis dan terbitkan 1 artikel blog baru seputar edukasi biaya, material, atau tips renovasi bangunan. | Tim Konten / Copywriter |
| **Bulanan (1x)** | Unggah minimal 1–2 portofolio proyek terbaru yang selesai dikerjakan lengkap dengan foto galeri ruangan. | Project Manager / Admin |
| **Bulanan (1x)** | Periksa menu **Pengaturan** jika ada nomor kontak atau data alamat yang mengalami pembaruan. | Manajemen Operasional |
| **Tahunan (1x Wajib)** | Lakukan pembayaran perpanjangan sewa nama domain `arsikarya.id` di DomaiNesia sebelum jatuh tempo. | Pemilik Bisnis / Finance |

---

## 7. Tanya Jawab & Solusi Masalah Umum (Troubleshooting FAQ)

### Q1: Saya sudah mengedit teks di Admin, mengapa saat saya buka website belum berubah?
* **Penyebab:** Browser di komputer/HP Anda menyimpan memori lama (*cache*).
* **Solusi:** Lakukan *Hard Refresh* pada browser:
  * Di Windows: Tekan tombol **Ctrl + F5** atau **Ctrl + Shift + R**.
  * Di Mac: Tekan tombol **Cmd + Shift + R**.
  * Di HP: Tutup tab browser dan buka kembali tautan web.

### Q2: Saya lupa kata sandi untuk masuk ke Dashboard Admin, bagaimana solusinya?
* **Solusi:** Di halaman login admin `https://arsikarya.id/admin/login`, klik tulisan **"Lupa kata sandi?"**. Masukkan email `webarsikarya@gmail.com`. Buka Gmail, cari email masuk berisi tautan untuk membuat kata sandi baru.

### Q3: Mengapa foto proyek gagal terunggah?
* **Penyebab:** Ukuran file foto terlalu besar (di atas 10–15 MB) atau koneksi internet terputus di tengah jalan.
* **Solusi:** Gunakan file foto berformat JPG, PNG, atau WebP dengan resolusi wajar (di bawah 5 MB per foto). Foto yang diunggah akan otomatis dioptimasi oleh Cloudinary.

### Q4: Apakah saya perlu sering membuka akun Neon DB, Vercel, atau Cloudinary?
* **Jawaban:** **Tidak perlu.** Ketiga layanan tersebut dirancang bekerja otomatis di latar belakang. Kebutuhan harian Anda (menulis artikel, upload foto proyek, melihat pesan calon klien, mengubah nomor WA) 100% dilakukan melalui Dashboard Admin website Arsi Karya yang jauh lebih ramah pengguna.

---

**Dokumen Resmi PT / Studio Arsi Karya**  
*Simpan buku panduan ini sebagai pegangan operasional harian tim Arsi Karya.*  
*Membangun Tuntas, Unggul Dalam Kualitas!* 🚀
