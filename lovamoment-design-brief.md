# Lovamoment.id - Design Brief (Phase 1 UI)

Dokumen ini melengkapi `lovamoment-site-spec.md`. Fokus: tampilan, interaksi, dan data produk.

---

## 0. Aturan penulisan (WAJIB, berlaku di seluruh situs)

**JANGAN gunakan em dash (—) di mana pun.** Tidak di headline, body copy, deskripsi produk, tooltip, email, maupun pesan WhatsApp. Ganti dengan titik, koma, titik dua, atau tanda kurung.

Contoh:
* Salah: "Kado digital premium — siap dalam 1 menit"
* Benar: "Kado digital premium, siap dalam 1 menit"

Berlaku juga untuk en dash (–). Untuk rentang angka gunakan kata "sampai" atau tanda strip biasa (-).

---

## 1. Design tokens

```css
:root {
  --primary:    #9E3B52;
  --accent:     #C89B6A;
  --bg:         #FDF6F4;
  --surface:    #FFFFFF;
  --text:       #3A2A2E;
  --text-muted: #7A6167;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 28px;

  --shadow-sm: 0 1px 2px rgba(90,40,52,.06);
  --shadow-lg: 0 8px 24px rgba(90,40,52,.08);
}
```

Font: **Cormorant Garamond 600** (heading), **Plus Jakarta Sans 400** (body/UI).
Aturan: dua warna aksen dan satu netral. Jangan tambah warna lain.

---

## 2. Prinsip: produk mendemokan dirinya sendiri

Screenshot statis adalah cara terlemah menjual kado digital. Pengunjung harus melihat template bergerak. Tapi ada batas performa (lihat bagian 8), jadi: video loop untuk yang selalu tampil, iframe live hanya saat diklik.

---

## 3. Halaman Home

### 3a. Hero
* **Phone frame** berisi **video loop muted** rekaman template membuka. Bukan iframe. Alasan: hero di atas fold dan menentukan LCP, sedangkan template Three.js berat di Android menengah.
* Iframe live baru dimuat kalau user klik "Lihat contoh".
* Headline berbasis manfaat dalam Bahasa Indonesia, bukan daftar fitur.
* Badge kecil melayang di sekitar phone frame (contoh: "Akses instan", "Aktif selamanya"). Ini efektif dan boleh dipertahankan.
* Subheadline menyebut harga mulai: **"Mulai dari Rp20.000"** (sesuaikan dengan harga terendah asli, jangan angka karangan).
* Satu CTA utama (Pilih Template) dan satu CTA sekunder (Lihat Katalog).
* **HAPUS "800+ Happy Customers", bintang lima, dan avatar pelanggan.** Belum ada pelanggan. Klaim palsu berisiko saat review Midtrans dan merusak kepercayaan. Kosongkan dulu, atau ganti dengan framing jujur seperti "Baru dibuka, jadi yang pertama".

### 3b. Belt marquee (running text)
Pita horizontal berjalan looping di bawah hero, berisi kata kunci tetap dipisah titik kecil:

`LOVAMOMENT.ID · PROSES LINK CEPAT · BEAUTIFUL MOMENT · HARGA TERJANGKAU · FULL CUSTOM · DESAIN PREMIUM · AKTIF SELAMANYA · MURAH BUKAN MURAHAN`

* Animasi murni CSS `transform: translateX()`, infinite, linear
* Duplikasi konten dua kali supaya loop mulus tanpa jeda
* `will-change: transform`, dan berhenti kalau `prefers-reduced-motion`
* **Jangan masukkan angka pelanggan** ke dalam pita ini

### 3c. Product belt (carousel berjalan)
Deretan kartu produk yang bergerak horizontal terus-menerus untuk menarik mata.

* Kartu bergerak pelan otomatis, berhenti saat hover atau saat disentuh
* Bisa di-drag/swipe manual
* Isi kartu: gambar produk, badge (NEW / POPULAR / #1 TERLARIS), nama, deskripsi satu baris, harga, tombol PESAN dan PREVIEW
* Gambar kartu pakai **video pendek muted**, bukan iframe
* Tombol "LIHAT SEMUA" di kanan judul section menuju katalog penuh

---

## 4. Halaman Katalog

Grid kartu produk, tiga kolom di desktop dan satu kolom di mobile.

Tiap kartu berisi:
* Thumbnail produk (video pendek muted, loop saat masuk viewport)
* Badge di pojok. Hanya lima ini, jangan tambah sendiri: `#1 TERLARIS`, `POPULAR`, `NEW`, `PREMIUM`, `EXCLUSIVE`
* Maksimal dua badge per kartu: satu badge status (`#1 TERLARIS` / `POPULAR` / `NEW`) dan satu badge tier (`PREMIUM` / `EXCLUSIVE`). Produk tier CLASSIC tidak menampilkan badge tier
* Nama produk dan label tier dalam kurung kalau ada
* Harga sekarang, dengan harga coret di sebelahnya
* **Beberapa tag occasion per produk** (lebih dari satu), tampil sebagai chip kecil dengan awalan "For"
* Tiga poin fitur singkat dengan ikon centang
* Dua tombol: LIHAT (buka demo) dan PESAN

Filter chips di atas grid berdasarkan tag occasion.

**Kosakata tag. Hanya enam ini, jangan tambah sendiri:**
`ANNIVERSARY` `BIRTHDAY` `CRUSH` `LDR` `ANY OCCASION` `GAME`

---

## 5. Halaman Detail Produk

Dua kolom di desktop, bertumpuk di mobile.

### Kolom kiri: galeri
* Menampilkan `sample1.jpg`, `sample2.jpg`, dan seterusnya dari folder template tersebut
* Tombol "Lihat Demo" melayang di atas galeri, membuka demo live dalam modal iframe
* Di bawahnya: carousel "Koleksi Halaman" dengan panah kiri/kanan dan indikator titik, menjelaskan tiap halaman/bagian yang ada di produk

### Kolom kanan: informasi
* Label tier di atas nama produk
* Nama produk (Cormorant Garamond)
* Deskripsi dua sampai tiga kalimat
* **Daftar fitur dengan simbol halus dan animasi loop kecil**
* Harga promo dan tombol PESAN

### Aturan penting untuk daftar fitur
**Tampilkan hanya fitur yang benar-benar ada di produk itu. Jangan tampilkan fitur yang tidak ada, bahkan dengan tanda silang atau abu-abu.** Setiap produk punya daftar fiturnya sendiri, tidak seragam.

**Fitur video rahasia sudah ditiadakan sepenuhnya.** Bukan sekadar disembunyikan dari copy: hapus dari kode, dari form order, dan dari daftar fitur mana pun. Pembeli tidak mengunggah video rahasia.

Animasi simbol: halus dan kecil saja (denyut lembut, putaran pelan, atau fade berulang). Amplitudo kecil, durasi 2 sampai 3 detik, hanya `transform` dan `opacity`.

---

## 6. Live customizer teaser

Dua input: nama penerima dan pesan singkat. Preview di phone frame ikut berubah saat user mengetik.

**Catatan implementasi:** CONFIG di template dibaca sekali saat load, tidak reaktif. Jadi:
* Kerjakan untuk **satu template saja** sebagai showcase, bukan 17
* Tambahkan dukungan query param di template itu (`?nama=...&pesan=...`)
* Debounce 400ms supaya iframe tidak reload tiap ketukan keyboard

---

## 7. Social proof

Testimoni bergaya bubble chat WhatsApp (bubble hijau, timestamp, centang biru). Pengunjung Indonesia langsung paham bahasa visualnya.

**Wajib: isi dengan testimoni asli. Sampai ada pesanan sungguhan, sembunyikan section ini.** Jangan karang nama, kutipan, atau angka.

Section "Cara Kerja": tiga langkah dihubungkan garis SVG yang menggambar sendiri saat scroll (animasi `stroke-dashoffset`).

---

## 8. Motion dan performa

**Boleh dipakai:**
* Scroll-reveal via `IntersectionObserver`, staggered 60ms per kartu
* Gradient text di headline (`background-clip: text`)
* Confetti burst saat CTA diklik (kode sudah ada di template birthday)
* Cursor-following glow, desktop saja
* Micro-interaction: `scale(0.97)` saat tombol ditekan
* Section divider berupa SVG wave atau torn-paper

**Aturan wajib:**
* Animasikan **hanya `transform` dan `opacity`**
* Hormati `prefers-reduced-motion` di semua animasi termasuk marquee
* **Lazy-load semua iframe.** Iframe hanya dibuat saat modal dibuka, dihancurkan saat ditutup
* Video loop: `muted`, `playsinline`, `preload="none"` untuk yang di bawah fold
* **Mobile-first.** Mayoritas traffic dari link WhatsApp/Instagram di Android menengah

---

## 9. Data produk (seed tabel `templates`)

Nama tampilan boleh disesuaikan. Slug harus persis seperti kolom pertama.

| Slug | Nama tampilan | Tier | Harga | Harga coret | Tag |
|---|---|---|---|---|---|
| 3d-ily | 3D I Love You | CLASSIC | 20.000 | 100.000 | CRUSH, LDR, ANY OCCASION |
| 3d-hearts-blue | 3D Hearts | CLASSIC | 20.000 | 100.000 | CRUSH, LDR, ANY OCCASION |
| kotak-musik | Kotak Musik | CLASSIC | 30.000 | 125.000 | ANNIVERSARY, BIRTHDAY, ANY OCCASION |
| lepas-lampion | Lepas Lampion | CLASSIC | 30.000 | 125.000 | ANNIVERSARY, LDR, ANY OCCASION |
| our-night-sky | Our Night Sky | CLASSIC | 30.000 | 125.000 | ANNIVERSARY, LDR, CRUSH |
| pesan-dalam-botol | Pesan Dalam Botol | CLASSIC | 30.000 | 125.000 | ANNIVERSARY, LDR, ANY OCCASION |
| scratch-card | Kartu Gosok Cinta | CLASSIC | 30.000 | 130.000 | BIRTHDAY, CRUSH, GAME |
| letter-botanical | Letter Botanical | PREMIUM | 40.000 | 160.000 | ANNIVERSARY, ANY OCCASION |
| letter-coastal | Letter Coastal | PREMIUM | 40.000 | 160.000 | ANNIVERSARY, LDR, ANY OCCASION |
| letter-goldenhour | Letter Golden Hour | PREMIUM | 40.000 | 160.000 | ANNIVERSARY, CRUSH, ANY OCCASION |
| letter-starlit | Letter Starlit | PREMIUM | 40.000 | 160.000 | ANNIVERSARY, LDR, ANY OCCASION |
| letter-vintage | Letter Vintage | PREMIUM | 40.000 | 160.000 | ANNIVERSARY, ANY OCCASION |
| claw-machine | Claw Machine | PREMIUM | 45.000 | 150.000 | BIRTHDAY, CRUSH, GAME |
| gacha-love | Gacha Love | PREMIUM | 45.000 | 150.000 | BIRTHDAY, CRUSH, GAME |
| premium-birthday-blush | Birthday Blush | EXCLUSIVE | 50.000 | 200.000 | BIRTHDAY |
| premium-birthday-nostalgic | Birthday Nostalgic | EXCLUSIVE | 50.000 | 200.000 | BIRTHDAY |
| premium-birthday-midnight | Birthday Midnight | EXCLUSIVE | 50.000 | 200.000 | BIRTHDAY |

### demo_url

| Slug | demo_url |
|---|---|
| 3d-ily | https://3d-ily-lovamoment.vercel.app/ |
| 3d-hearts-blue | https://3d-hearts-blue-lovamoment.vercel.app/ |
| kotak-musik | https://kotak-musik-lovamoment.vercel.app/ |
| lepas-lampion | https://lepas-lampion-lovamoment.vercel.app/ |
| our-night-sky | https://our-night-sky-lovamoment.vercel.app/ |
| pesan-dalam-botol | https://pesan-dalam-botol-lovamoment.vercel.app/ |
| scratch-card | https://scratch-card-lovamoment.vercel.app/ |
| letter-botanical | https://letter-botanical-lovamoment.vercel.app/ |
| letter-coastal | https://letter-coastal-lovamoment.vercel.app/ |
| letter-goldenhour | https://letter-goldenhour-lovamoment.vercel.app/ |
| letter-starlit | https://letter-starlit-lovamoment.vercel.app/ |
| letter-vintage | https://letter-vintage-lovamoment.vercel.app/ |
| claw-machine | https://claw-machine-lovamoment.vercel.app/ |
| gacha-love | https://gacha-love-lovamoment.vercel.app/ |
| premium-birthday-blush | https://premium-birthday-blush-lovamoment.vercel.app/ |
| premium-birthday-nostalgic | https://premium-birthday-nostalgic-lovamoment.vercel.app/ |
| premium-birthday-midnight | https://premium-birthday-midnight-lovamoment.vercel.app/ |

### Rename folder lokal
* `premium-birthday-emerald` menjadi `premium-birthday-nostalgic`
* `3d-i-love-you` menjadi `3d-ily`

Kedua pasangan itu template yang sama, cuma beda penamaan. Setelah rename, semua tempat (folder, slug, tabel, URL) memakai satu nama saja.

---

## 10. Screenshot produk

* Disimpan sebagai `sample1.jpg`, `sample2.jpg`, dan seterusnya di dalam folder masing-masing template
* Dipakai sebagai **galeri di halaman detail produk**
* Konvensi ini terpisah dari `image1.jpg` (foto pembeli), jangan sampai tertukar
* Semua ekstensi huruf kecil (`.jpg`, bukan `.JPG`). Vercel jalan di Linux yang membedakan huruf besar dan kecil

---

## 11. Daftar hal yang harus DIHAPUS dari build sekarang

1. Semua produk karangan: Memoria, Letter Edition, Voices Gift, Mixtape Edition, Invitation Edition, Arcade Edition, Memories Wrapped. Ganti dengan 17 template asli di bagian 9.
2. "800+ Happy Customers", rating bintang, dan avatar pelanggan di hero.
3. Testimoni karangan, kalau ada.
4. Semua em dash (—) di seluruh copy.
5. Fitur video rahasia: hapus dari kode, form order, deskripsi produk, dan daftar fitur.
6. Field upload `cover-image.jpg`: hapus dari form order dan dari kode. Pembeli tidak lagi mengunggah cover image.
7. Harga karangan (Rp15.000 dan sejenisnya). Pakai daftar harga asli di bagian 9.
8. Tag di luar enam kosakata resmi, dan badge di luar lima yang terdaftar.

---

## 12. Perbaikan konten default per template (demo content)

Konten default di tiap template nanti akan dicustom pembeli, tapi versi demo/default harus tetap terlihat natural dan penuh perasaan. Aturan umum yang berlaku untuk SEMUA poin di bawah:

* **Tanpa em dash (—) dan tanpa en dash (–).** Pakai titik, koma, titik dua, atau kurung.
* **Nama default seragam di seluruh template:** penerima = **Zia**, penulis/pengirim = **Leo**. Ganti semua nama contoh lama (Anisa, Dennis, Siti, Angel, Dino, dan sejenisnya) menjadi pasangan ini.

### 12a. Template surat-menyurat
Berlaku untuk: `lepas-lampion`, `pesan-dalam-botol`, `letter-botanical`, `letter-coastal`, `letter-goldenhour`, `letter-starlit`, `letter-vintage`.

* Tulis ulang isi surat default supaya mengalir natural dan terasa penuh kecintaan, bukan kaku atau template-y.
* Bahasa Indonesia hangat, personal, tidak berlebihan/lebay. Boleh campur satu dua frasa Inggris kalau pas.
* Ditujukan dari Leo untuk Zia.
* Tetap tanpa em dash. Pisahkan paragraf dengan baris baru (sesuai pola CONFIG tiap template).
* Panjang wajar sesuai ruang template, jangan sampai meluber keluar layout.

### 12b. scratch-card
* Ganti judul dan caption di tiap foto menjadi lebih generic (netral, tidak terikat momen spesifik), supaya cocok jadi contoh umum.
* Tetap dari Leo untuk Zia.

### 12c. Tiga template premium-birthday
Berlaku untuk: `premium-birthday-blush`, `premium-birthday-nostalgic`, `premium-birthday-midnight`.

* **Hilangkan caption pada foto** di bagian galeri (our gallery). Foto tampil tanpa teks caption.
* Elemen lain (judul, ucapan) tetap ada, hanya caption per-foto yang dihapus.

### 12d. claw-machine
* Tanggal mengikuti **tanggal hari ini secara otomatis** (dinamis saat halaman dibuka), bukan tanggal yang dicustom atau di-hardcode.
* Gunakan waktu lokal pembuka halaman.
