import Link from "next/link";
import { waLink } from "@/lib/whatsapp";

const FAQS = [
  {
    q: "Berapa harga template di Lovamoment.id?",
    a: "Harga bervariasi per template, mulai dari tier Classic sampai Exclusive. Bisa dicek langsung di halaman detail tiap template pada Gallery.",
  },
  {
    q: "Berapa lama proses sampai link jadi?",
    a: "Setelah pembayaran berhasil dikonfirmasi, tim kami memproses dan mengirim link personal kamu, biasanya dalam hitungan jam di hari yang sama.",
  },
  {
    q: "Metode pembayaran apa saja yang didukung?",
    a: "QRIS, GoPay, OVO, DANA, ShopeePay, transfer bank (Virtual Account), kartu debit/kredit, dan gerai retail. Semua diproses aman lewat payment gateway.",
  },
  {
    q: "Bisa revisi kalau ada kesalahan data atau typo?",
    a: "Bisa. Hubungi kami lewat WhatsApp sebelum atau setelah link dikirim, dan kami bantu perbaiki data (nama, tanggal, foto, pesan) tanpa biaya tambahan untuk kesalahan minor.",
  },
  {
    q: "Apakah saya bisa memilih link/URL sendiri?",
    a: "Ya. Saat checkout kamu bisa pilih custom slug sendiri, misalnya lovamoment.id/v/buat-ayang, selama belum dipakai orang lain.",
  },
  {
    q: "Foto dan musik apa yang bisa diupload?",
    a: "Tergantung template: tiap template punya jumlah slot foto tertentu, dan sebagian mendukung musik latar. Detailnya ada di halaman tiap template.",
  },
  {
    q: "Apakah link-nya berlaku selamanya?",
    a: "Link personal kamu tetap aktif selama domain dan hosting berjalan, cocok disimpan sebagai kenangan jangka panjang.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
        Pertanyaan yang Sering Diajukan
      </h1>
      <p className="mt-3 text-text-muted">
        Nggak nemu jawabannya di sini? Langsung chat kami aja lewat WhatsApp.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-primary/12 bg-surface p-5 open:border-primary/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text">
              {item.q}
              <span className="text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-primary/12 bg-surface px-6 py-10 text-center">
        <h2 className="font-display text-xl font-semibold text-text">Masih ada pertanyaan?</h2>
        <p className="max-w-md text-sm text-text-muted">
          Tim kami siap bantu jawab pertanyaanmu soal template, harga, atau proses pemesanan.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={waLink("Halo Lovamoment.id, aku ada pertanyaan nih 🙋")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Chat WhatsApp
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-primary/25 px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/40"
          >
            Halaman Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
