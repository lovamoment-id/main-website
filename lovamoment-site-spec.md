# Lovamoment.id: Website Spec (v2, arsitektur final)

## 1. Tujuan
Website toko untuk Lovamoment.id. Pembeli memilih template, mengisi data + upload aset, membayar, lalu link kado personalnya langsung aktif, tanpa proses manual sama sekali.

## 2. Arsitektur (final)

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js (App Router) di Vercel | Frontend + backend dalam satu repo, satu deploy |
| Database | Supabase Postgres, dipasang lewat **Vercel Marketplace** | Kredensial otomatis masuk ke env project. Satu dashboard, satu tagihan, jadi "satu pintu" tetap terpenuhi |
| Storage aset | Supabase Storage | Foto dan musik pembeli |
| Payment | Midtrans Snap | QRIS, e-wallet, VA, kartu |
| Otomasi | **Next.js API Routes** (bukan Make.com) | Webhook Midtrans → update DB → kirim link. Tidak ada tool otomasi pihak ketiga |
| Email | Resend (atau SMTP lain) | Pengiriman link |
| WhatsApp | Fonnte / Wablas | Pengiriman link + konfirmasi |

**Yang dihapus dari v1:** Make.com, Vercel Deploy API, proses build-per-pesanan.

## 3. Prinsip inti: template tetap HTML mentah

Template TIDAK ditulis ulang jadi komponen React. File `.html` single-file yang sudah ada disimpan apa adanya di repo (`/templates/[slug]/index.html`).

Route `/v/[slug]` bekerja begitu link dibuka:
1. Baca `slug` dari URL
2. Cari order di Supabase → dapat `template_slug`, `config_json`, `asset_urls_json`
3. Kalau `payment_status` belum lunas → tampilkan halaman "belum aktif"
4. Kalau lunas → baca file template, ganti blok CONFIG dengan data pembeli, kirim HTML ke browser

**Alasan:** Three.js r128, canvas, WebAudio, pola dua halaman `.hidden`, satu rAF loop: semua sudah teruji di mobile. Menulis ulang jadi React akan merusaknya dan memaksa tiap template baru dibuat dua kali.

**Satu-satunya perubahan pada template:** tambah `ASSET_BASE` di CONFIG.
```
ASSET_BASE: 'https://xxxx.supabase.co/storage/v1/object/public/orders/ORDER_ID/'
...
ASSET_BASE + 'image' + (i + 1) + '.jpg'
```
Konvensi penamaan tetap: `image1.jpg` sampai `image(n).jpg`, dan `music.mp3`.
**`cover-image.jpg` DIHAPUS dari konvensi.** Pembeli tidak lagi mengunggah cover image. Kalau ada template yang masih memakainya, ganti dengan `image1.jpg` atau hilangkan elemen covernya.

## 4. Sitemap

| Halaman | Route | Isi |
|---|---|---|
| Home | `/` | Hero, 3 langkah, kategori, testimoni, FAQ, CTA |
| Katalog | `/gallery` | Semua template + filter kategori + sort |
| Detail | `/template/[slug]` | Deskripsi, sample, tombol Demo + Order |
| Demo | - | **Deployment Vercel terpisah yang sudah ada** (`[slug]-lovamoment.vercel.app`), dibuka via modal iframe dari galeri. Route `/preview/[slug]` tidak jadi dibuat |
| Order | `/order/[slug]` | Form adaptif per template + custom slug + voucher → Snap |
| Konfirmasi | `/order/[slug]/confirmation` | Status pembayaran |
| **Produk pembeli** | `/v/[slug]` | Kado jadi, dirender dari database |
| FAQ / Kontak | `/faq`, `/contact` | Info + tombol WhatsApp |

## 5. Alur pesanan

1. Pembeli pilih template di katalog → lihat demo
2. Isi form: nama pembeli, nama penerima, email, no. WhatsApp, pesan, tanggal, upload foto (jumlah fixed per template), musik; pilih custom slug; opsional voucher. **Tidak ada upload cover image dan tidak ada upload video rahasia.**
3. Aset di-upload ke Supabase Storage (rename otomatis: slot 1 → `image1.jpg`, dst.), data teks ke tabel `orders`, status `pending`
4. Snap popup muncul → pembeli bayar
5. Midtrans kirim webhook ke `/api/webhooks/midtrans`
6. API Route: verifikasi signature → cek `settlement`/`capture` → update status jadi `paid` → balas 200
7. API Route kirim link ke pembeli via **email + WhatsApp**
8. `/v/[slug]` langsung aktif (hitungan detik, tanpa deploy)

**Revisi teks pembeli = edit satu baris di Supabase.** Tidak perlu deploy ulang.

## 6. Data Model (Supabase)

**orders**
- `id`, `template_slug`
- `recipient_name`, `buyer_name`, `buyer_email`, `buyer_whatsapp`
- `custom_slug` (unik, contoh `buat-ayang`)
- `config_json`, `asset_urls_json`
- `voucher_code`, `discount_amount`
- `payment_status` (pending/paid/failed), `payment_method`, `amount`, `midtrans_order_id`
- `delivery_status` (pending/sent), `delivery_link`
- `created_at`, `updated_at`

**templates**
- `slug`, `name`, `category`, `tier` (CLASSIC/PREMIUM/EXCLUSIVE)
- `price`, `original_price`
- `photo_count`, `supports_music`
- `form_fields_json` (field apa yang muncul di form)
- `html_path` (lokasi file template di repo)
- `sold_count`, `is_new`, `is_bestseller`

**vouchers**
- `code`, `type` (percent/fixed), `value`, `active`, `expires_at`, `usage_limit`, `used_count`

## 7. Fitur toko
- Harga bertingkat per template + harga coret
- Custom slug (validasi unik live + sanitasi: huruf kecil, spasi jadi strip, blokir karakter aneh, sediakan alternatif kalau bentrok)
- Kode voucher (tombol "Pakai" sebelum bayar)
- Form adaptif per template dari `form_fields_json` + `photo_count`
- Social proof: "X terjual", badge Terbaru / #1 Terlaris, rating, popup order terbaru. Prioritas rendah, bisa menyusul

## 8. Desain

**Brand: rose & gold** (menggantikan arah biru navy sebelumnya, logo ikut diganti ke palet ini).

Semua di-tokenize di `:root`:
```
--primary:    #9E3B52   /* rose tua */
--accent:     #C89B6A   /* gold */
--bg:         #FDF6F4   /* krem hangat */
--surface:    #FFFFFF
--text:       #3A2A2E
--text-muted: #7A6167
--radius-sm: 8px;  --radius-md: 16px;  --radius-lg: 28px;
--shadow-sm: 0 1px 2px rgba(90,40,52,.06);
--shadow-lg: 0 8px 24px rgba(90,40,52,.08);
```

Font: **Cormorant Garamond 600** (heading) + **Plus Jakarta Sans 400** (body/UI).

Aturan: dua warna aksen + satu netral saja. Shell tetap tenang supaya thumbnail template yang warnanya beragam tetap menonjol.

Bahasa: campur Indonesia-Inggris, sesuai gaya template yang sudah ada.

Detail lengkap section-per-section ada di `lovamoment-design-brief.md`.

## 9. Admin
Pakai dashboard Supabase bawaan untuk v1. Bisa lihat, filter, dan edit semua pesanan langsung. Route `/admin` sendiri ditunda sampai volume pesanan besar.

## 10. Di luar cakupan v1
- Akun/login pembeli
- Keranjang multi-produk
- Refund otomatis (manual lewat dashboard Midtrans)
