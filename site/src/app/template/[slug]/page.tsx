import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatRupiah,
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
                  src={images[0]}
                  alt={template.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.slice(1).map((src) => (
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

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-text-muted">Slot foto</dt>
              <dd className="text-text">{template.photoCount || "Tidak ada"}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Musik latar</dt>
              <dd className="text-text">{template.supportsMusic ? "Ya" : "Tidak"}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={template.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-primary/25 px-6 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-primary/40"
            >
              Lihat Demo
            </a>
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
