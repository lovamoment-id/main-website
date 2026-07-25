import { waLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function ContactPage() {
  const displayNumber = "+" + WHATSAPP_NUMBER;

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 text-center sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">Hubungi Kami</h1>
      <p className="mt-3 text-text-muted">
        Ada pertanyaan soal template, harga, atau mau custom sesuatu? Chat langsung, kami balas secepatnya.
      </p>

      <div className="mt-10 rounded-2xl border border-primary/12 bg-surface p-8">
        <span className="text-4xl">💬</span>
        <h2 className="mt-4 font-display text-xl font-semibold text-text">WhatsApp</h2>
        <p className="mt-1 text-sm text-text-muted">{displayNumber}</p>
        <a
          href={waLink("Halo Lovamoment.id, aku mau tanya-tanya 😊")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Chat Sekarang
        </a>
      </div>

      <p className="mt-8 text-xs text-text-muted">
        Jam operasional: setiap hari, 09.00 sampai 21.00 WIB.
      </p>
    </div>
  );
}
