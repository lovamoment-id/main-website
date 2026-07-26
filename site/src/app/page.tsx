import Link from "next/link";
import BeltMarquee from "@/components/BeltMarquee";
import HeroPhone from "@/components/HeroPhone";
import ProductBelt from "@/components/ProductBelt";
import Reveal from "@/components/Reveal";
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

/*
 * UNVERIFIED CONTENT. These three quotes are written copy, not statements from
 * real buyers, added at the owner's explicit instruction and on their stated
 * responsibility. Nobody named below has used the product. Replace each entry
 * with a genuine quote once real orders exist, and keep names to whatever the
 * customer actually agreed to publish.
 */
const TESTIMONIALS = [
  {
    quote:
      "Awalnya cuma mau kirim ucapan biasa. Pas dia buka linknya dan lagu kami muter, dia diem lama terus nelpon sambil nangis. Worth it banget.",
    name: "Rangga",
    context: "Anniversary ke-3",
  },
  {
    quote:
      "Kami LDR beda pulau, jadi susah kasih kado fisik. Ini solusinya. Prosesnya cepat, tinggal kirim link, dan dia bisa buka kapan aja.",
    name: "Fajar",
    context: "Hadiah LDR",
  },
  {
    quote:
      "Buat ulang tahun sahabatku. Yang bikin beda itu detail kecilnya, foto-foto kami muncul satu per satu sambil dia scroll. Dia simpen linknya sampai sekarang.",
    name: "Nadia",
    context: "Ulang tahun sahabat",
  },
];

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
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-10">
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
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <div className="flex flex-col gap-2">
                  <span className="font-display text-3xl font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-text">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Untuk Momen Apa?</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tags.map((tag, i) => (
            <Reveal key={tag} delay={i * 60}>
              <Link
                href={`/gallery?tag=${encodeURIComponent(tag)}`}
                className="flex h-full flex-col items-center gap-2 rounded-2xl border border-primary/12 bg-surface px-4 py-8 text-center transition-colors hover:border-primary/30"
              >
                <span className="text-3xl">{TAG_ICON[tag]}</span>
                <span className="font-display text-lg font-semibold text-text">
                  {tagLabels[tag]}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-surface py-24 sm:py-28">
        <Reveal>
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
        </Reveal>

        {/* Full-bleed so cards run off both edges instead of stopping at the
            container, which is what makes the belt read as continuous. */}
        <div className="mt-10 px-5 sm:px-8">
          <ProductBelt>
            {belt.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </ProductBelt>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Kata Mereka</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="flex h-full flex-col gap-5 rounded-3xl border border-primary/12 bg-surface p-7">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
                  &ldquo;
                </span>
                <blockquote className="flex-1 text-sm leading-relaxed text-text">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3 border-t border-primary/10 pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-base font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-display text-base font-semibold text-text">{t.name}</span>
                    <span className="text-xs text-text-muted">{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">FAQ</h2>
              <Link href="/faq" className="text-sm font-semibold text-primary hover:text-primary/80">
                Lihat semua →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 flex flex-col gap-4">
            {FAQ_PREVIEW.map((item, i) => (
              <Reveal key={item.q} delay={i * 90}>
                <div className="rounded-2xl border border-primary/12 bg-surface p-5">
                  <h3 className="font-semibold text-text">{item.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-primary/12 px-6 py-10 text-center">
              <h3 className="font-display text-xl font-semibold text-text">Masih ada yang mau ditanyakan?</h3>
              <p className="max-w-md text-sm text-text-muted">
                Chat kami langsung lewat WhatsApp. Kami bantu jawab soal template, harga, atau proses pemesanan.
              </p>
              <a
                href={waLink("Halo Lovamoment.id, aku ada pertanyaan nih 🙋")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Chat WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-32">
        <Reveal>
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
        </Reveal>
      </section>
    </>
  );
}
