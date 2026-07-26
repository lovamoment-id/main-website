import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoButton from "@/components/DemoButton";
import {
  formatRupiah,
  getCoverImage,
  getSampleImages,
  getTemplateBySlug,
  tagLabels,
  templates,
  tierLabels,
} from "@/lib/templates";
import { waLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const images = getSampleImages(template);
  const cover = getCoverImage(template);
  // Rest of the gallery strip, in their original 1..N order, minus whichever
  // one is already shown as the hero above (design brief §10 still lists them
  // in that order; only which one leads changes).
  const gallery = images.filter((src) => src !== cover);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Link href="/gallery" className="text-sm font-medium text-text-muted hover:text-text">
        ← Kembali ke Gallery
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          {images.length > 0 ? (
            <div className="grid gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg">
                <Image
                  src={cover}
                  alt={template.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {gallery.map((src) => (
                    <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-bg">
                      <Image src={src} alt={template.name} fill sizes="33vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
              <span className="font-display text-6xl text-primary/70">♥</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text">
              {tierLabels[template.tier]}
            </span>
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/15 px-3 py-1 text-xs text-text-muted"
              >
                For {tagLabels[tag]}
              </span>
            ))}
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold text-text sm:text-4xl">
            {template.name}
          </h1>
          <p className="mt-2 text-text-muted">{template.tagline}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-text">
              {formatRupiah(template.price)}
            </span>
            <span className="text-sm text-text-muted line-through">
              {formatRupiah(template.originalPrice)}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{template.soldCount} terjual</p>

          <p className="mt-6 leading-relaxed text-text">{template.description}</p>

          {/* Only real capabilities are listed. A template never shows a
              feature it lacks, not even greyed out (design brief §5). */}
          <ul className="mt-6 flex flex-col gap-3">
            {template.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-text">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature}
              </li>
            ))}
            {template.photoCount > 0 && (
              <li className="flex items-start gap-3 text-sm leading-relaxed text-text">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {template.photoCount} slot foto yang kamu isi sendiri
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DemoButton
              demoUrl={template.demoUrl}
              name={template.name}
              className="flex-1 rounded-full border border-primary/25 px-6 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-primary/40"
            >
              Lihat Demo
            </DemoButton>
            <a
              href={waLink(`Halo, saya mau pesan template "${template.name}" 💌`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Pesan Sekarang
            </a>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Live preview otomatis dan checkout online akan segera hadir. Untuk sekarang, klik untuk chat langsung via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
