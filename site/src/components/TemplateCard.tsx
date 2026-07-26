import Link from "next/link";
import Image from "next/image";
import DemoButton from "@/components/DemoButton";
import type { Template } from "@/lib/templates";
import {
  formatRupiah,
  getCoverImage,
  tagLabels,
  tierBadgeLabels,
} from "@/lib/templates";
import { waLink } from "@/lib/whatsapp";

/* Gold is too light to carry text on a light surface (2.35:1), so EXCLUSIVE
   uses the gold as a tint behind dark text instead of as the text colour. */
const TIER_BADGE_STYLES: Record<string, string> = {
  PREMIUM: "bg-primary/10 text-primary",
  EXCLUSIVE: "bg-accent/25 text-text",
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  "#1 TERLARIS": "bg-accent text-text",
  POPULAR: "bg-primary text-white",
  NEW: "bg-surface text-primary shadow-sm",
};

export default function TemplateCard({ template }: { template: Template }) {
  const cover = getCoverImage(template);
  const tierBadge = tierBadgeLabels[template.tier];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-primary/12 bg-surface transition-colors hover:border-primary/30">
      <Link href={`/template/${template.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-bg">
        <Image
          src={cover}
          alt={template.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* At most two badges: one tier (left) and one status (right). */}
        {tierBadge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TIER_BADGE_STYLES[tierBadge]}`}
          >
            {tierBadge}
          </span>
        )}
        {template.statusBadge && (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_BADGE_STYLES[template.statusBadge]}`}
          >
            {template.statusBadge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <Link href={`/template/${template.slug}`}>
            <h3 className="font-display text-xl font-semibold text-text">
              {template.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm leading-snug text-text-muted">{template.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/15 px-2 py-0.5 text-[11px] text-text-muted"
              >
                For {tagLabels[tag]}
              </span>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-1.5">
          {template.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs leading-snug text-text-muted">
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold text-text">
                {formatRupiah(template.price)}
              </span>
              <span className="text-xs text-text-muted line-through">
                {formatRupiah(template.originalPrice)}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">{template.soldCount} terjual</p>
          </div>
        </div>

        <div className="flex gap-2">
          <DemoButton
            demoUrl={template.demoUrl}
            name={template.name}
            className="flex-1 rounded-full border border-primary/25 px-3 py-2 text-center text-xs font-semibold text-text transition-colors hover:border-primary/40"
          >
            Lihat
          </DemoButton>
          <a
            href={waLink(`Halo, saya mau pesan template "${template.name}" 💌`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Pesan
          </a>
        </div>
      </div>
    </div>
  );
}
