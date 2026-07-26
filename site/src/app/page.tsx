import Link from "next/link";
import BeltMarquee from "@/components/BeltMarquee";
import HeroPhone from "@/components/HeroPhone";
import ProductBelt from "@/components/ProductBelt";
import TemplateCard from "@/components/TemplateCard";
import { formatRupiah, tagLabels, tags, templates, type StatusBadge } from "@/lib/templates";
import { waLink } from "@/lib/whatsapp";

const STEPS = [
  {
    title: "Pilih Template",
    text: "Jelajahi gallery, cari template yang paling cocok buat momen dan orang yang kamu tuju.",
  },
  {
    title: "Isi & Bayar",
    text: "Lengkapi nama, foto, pesan, dan lagu. Bayar aman lewat QRIS, e-wallet, atau transfer bank.",
  },
  {
    title: "Kirim ke Doi",
    text: "Link personal jadi dan langsung dikirim ke email & WhatsApp kamu, siap dibagikan.",
  },
];

const TAG_ICON: Record<string, string> = {
  ANNIVERSARY: "💍",
  BIRTHDAY: "🎂",
  CRUSH: "💌",
  LDR: "✈️",
  "ANY OCCASION": "✨",
  GAME: "🎮",
};

/** Cards with the strongest badge lead the featured row. */
const BADGE_RANK: Record<StatusBadge, number> = {
  "#1 TERLARIS": 0,
  POPULAR: 1,
  NEW: 2,
};

/* Social proof section intentionally absent: no real orders yet, so there are no
   genuine testimonials to show (design brief §7). Do not seed placeholder ones. */

const FAQ_PREVIEW = [
  {
    q: "Berapa lama proses sampai linknya jadi?",
    a: "Setelah pembayaran berhasil, link personal kamu biasanya siap dalam hitungan jam.",
  },
  {
    q: "Bisa revisi kalau ada salah data?",
    a: "Bisa. Hubungi kami lewat WhatsApp dan kami bantu sesuaikan sebelum link final dikirim.",
  },
];

export default function Home() {
  const startingPrice = Math.min(...templates.map((t) => t.price));
  // Badged templates lead the belt; the rest follow so all 17 get shown.
  const belt = [...templates].sort((a, b) => {
    const rank = (t: (typeof templates)[number]) =>
      t.statusBadge ? BADGE_RANK[t.statusBadge] : 9;
    return rank(a) - rank(b);
  });

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(158,59,82,0.10),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <span className="rounded-full border border-primary/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-text-muted">
              Hadiah digital personal
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl md:text-6xl">
              Kirim kenangan lewat <span className="text-primary">website personal</span>, bukan sekadar chat.
            </h1>
            <p className="max-w-xl text-base text-text-muted sm:text-lg">
              Surat digital, ucapan ulang tahun, dan template interaktif untuk pasangan, sahabat, atau keluarga,
              lengkap dengan foto, musik, dan pesanmu sendiri.
            </p>
            <p className="text-sm text-text-muted">
              Mulai dari <span className="font-display text-xl font-semibold text-text">{formatRupiah(startingPrice)}</span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gallery"
                className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Pilih Template
              </Link>
              <a
                href={waLink("Halo Lovamoment.id, aku mau tanya-tanya soal template hadiahnya 😊")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary/25 px-7 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/40"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>

          <HeroPhone />
        </div>
      </section>

      <BeltMarquee />

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-2">
                <span className="font-display text-3xl font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-semibold text-text">{step.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Untuk Momen Apa?</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/gallery?tag=${encodeURIComponent(tag)}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-primary/12 bg-surface px-4 py-8 text-center transition-colors hover:border-primary/30"
            >
              <span className="text-3xl">{TAG_ICON[tag]}</span>
              <span className="font-display text-lg font-semibold text-text">
                {tagLabels[tag]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-surface py-16">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Semua Template
          </h2>
          <Link
            href="/gallery"
            className="shrink-0 rounded-full border border-primary/25 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-text transition-colors hover:border-primary/40"
          >
            Lihat Semua
          </Link>
        </div>

        {/* Full-bleed so cards run off both edges instead of stopping at the
            container, which is what makes the belt read as continuous. */}
        <div className="mt-8 px-5 sm:px-8">
          <ProductBelt>
            {belt.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </ProductBelt>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">FAQ</h2>
            <Link href="/faq" className="text-sm font-semibold text-primary hover:text-primary/80">
              Lihat semua →
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {FAQ_PREVIEW.map((item) => (
              <div key={item.q} className="rounded-2xl border border-primary/12 bg-surface p-5">
                <h3 className="font-semibold text-text">{item.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
          Siap bikin kejutan hari ini?
        </h2>
        <p className="mt-3 text-text-muted">Pilih template, isi ceritamu, kirim ke doi dalam hitungan jam.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/gallery"
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
