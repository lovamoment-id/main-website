import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { tagLabels, tags, templates, type Tag } from "@/lib/templates";

const SORTS = [
  { key: "populer", label: "Terlaris" },
  { key: "termurah", label: "Termurah" },
  { key: "termahal", label: "Termahal" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

function buildHref(tag: string | undefined, sort: string | undefined) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}) {
  const { tag, sort } = await searchParams;

  const activeTag = tags.includes(tag as Tag) ? (tag as Tag) : undefined;
  const activeSort: SortKey = SORTS.some((s) => s.key === sort) ? (sort as SortKey) : "populer";

  const filtered = templates.filter((t) => !activeTag || t.tags.includes(activeTag));

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "termurah") return a.price - b.price;
    if (activeSort === "termahal") return b.price - a.price;
    return b.soldCount - a.soldCount;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">Gallery Template</h1>
        <p className="mt-3 text-text-muted">
          {templates.length} template siap dipersonalisasi: surat digital, ucapan ulang tahun, dan template interaktif.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(undefined, sort)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeTag ? "bg-primary text-white" : "border border-primary/25 text-text hover:border-primary/40"
            }`}
          >
            Semua
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={buildHref(t, sort)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTag === t ? "bg-primary text-white" : "border border-primary/25 text-text hover:border-primary/40"
              }`}
            >
              {tagLabels[t]}
            </Link>
          ))}
        </div>

        <div className="flex gap-2">
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={buildHref(tag, s.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeSort === s.key ? "bg-primary/10 text-text" : "text-text-muted hover:text-text"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-text-muted">Belum ada template dengan tag ini.</p>
      )}
    </div>
  );
}
