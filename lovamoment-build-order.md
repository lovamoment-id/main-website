# Lovamoment.id: Build Order (v2)

Serahkan file ini + spec ke Claude Code. Bangun per fase, deploy di akhir tiap fase.

---

## Phase 0: Persiapan akun (dikerjakan David, tanpa kode)
- [ ] Beli domain `lovamoment.id` di registrar PANDI (Qwords/Domainesia/Rumahweb/Niagahoster). Siapkan KTP untuk verifikasi. Cek harga **renewal**, bukan cuma promo tahun pertama
- [ ] Daftar Midtrans → simpan **Sandbox** Server Key + Client Key
- [ ] Buat akun Supabase (bisa lewat Vercel Marketplace nanti saat scaffold)
- [ ] Buat GitHub org `Lovamoment.id` + repo kosong
- [ ] Akun Vercel, hubungkan ke repo
- [ ] Install Claude Code (`curl -fsSL https://claude.ai/install.sh | bash` atau versi PowerShell), cek `claude --version`
- [ ] Kumpulkan 17 file template `.html` + aset demo tiap template ke satu folder
- [ ] (Nanti, Phase 4) akun Resend + akun Fonnte/Wablas

---

## Phase 1: Toko (belum ada pembayaran)
- [ ] Scaffold Next.js, push ke repo, hubungkan Vercel, pasang domain `.id`
- [ ] Design token brand rose & gold di `:root`, persis seperti daftar token di `lovamoment-design-brief.md` bagian 1
- [ ] Pasang Supabase lewat Vercel Marketplace, seed tabel `templates` (slug, nama, kategori, tier, harga, photo_count, dll)
- [ ] Home: hero, 3 langkah, kategori, FAQ, CTA, tombol WhatsApp melayang
- [ ] Katalog `/gallery`: kartu template + tier badge + harga + filter + sort
- [ ] Detail `/template/[slug]`
- [ ] **Deploy.** Checkpoint: lovamoment.id hidup dan on-brand.

## Phase 2: Demo template (jauh lebih ringan sekarang)
Demo **sudah ada** sebagai 17 deployment Vercel terpisah, jadi tidak perlu bikin `/preview/[slug]`.
- [ ] Simpan `demo_url` tiap template ke tabel `templates`
- [ ] Modal iframe di galeri: klik kartu → buka demo_url (lazy-load, jangan render sebelum diklik)
- [ ] Simpan 17 file HTML ke `/templates/[slug]/index.html` (ini untuk produksi `/v/[slug]` di Phase 4, bukan demo)
- [ ] Tambah `ASSET_BASE` di CONFIG tiap template (script Python global)
- [ ] **Deploy.** Checkpoint: demo bisa dibuka dari galeri.

## Phase 3: Form + pembayaran
- [ ] Tabel `orders` + `vouchers` + bucket Supabase Storage
- [ ] Form `/order/[slug]` adaptif per template (field dari `form_fields_json`, jumlah foto dari `photo_count`)
- [ ] Upload → Supabase Storage, rename otomatis `image1.jpg` … `music.mp3` (pakai Sharp untuk konversi HEIC/PNG → JPG + kompres)
- [ ] Field custom slug: cek unik live + sanitasi
- [ ] Field voucher: tombol "Pakai" → validasi → total berubah
- [ ] Midtrans Snap: buat transaction token → popup
- [ ] `/api/webhooks/midtrans`: **verifikasi signature hash dulu**, cek `settlement`/`capture`, update status, balas 200
- [ ] Halaman konfirmasi
- [ ] Tes penuh di Sandbox
- [ ] **Deploy.** Checkpoint: pesanan tes masuk Supabase sebagai lunas.

## Phase 4: Produk jadi + pengiriman (ringan)
- [ ] Route `/v/[slug]`: cari order → kalau belum lunas tampilkan "belum aktif" → kalau lunas inject CONFIG ke HTML template → kirim ke browser
- [ ] Dari webhook, kirim link via Resend (email) + Fonnte/Wablas (WhatsApp)
- [ ] Update `delivery_status` + `delivery_link`
- [ ] Tes satu putaran penuh: order → bayar → link aktif → notifikasi masuk
- [ ] Ganti Midtrans ke **Production key** setelah verifikasi bisnis selesai
- [ ] **Deploy.** Checkpoint: otomatis penuh.

---

## Catatan untuk Claude Code
- Semua secret di environment variable Vercel, jangan pernah di repo
- **Jangan tulis ulang template jadi komponen React.** Sajikan HTML mentah, ganti blok CONFIG saja
- Konvensi aset wajib: `'image' + (i + 1) + '.jpg'` dan `music.mp3`. **Tidak ada `cover-image.jpg`** dan tidak ada video rahasia
- Verifikasi signature webhook Midtrans adalah wajib, bukan opsional
- Kerjakan satu template dulu sampai jalan sebelum lanjut ke 16 sisanya
- Minta penjelasan sebelum perubahan besar, terutama di bagian webhook pembayaran
