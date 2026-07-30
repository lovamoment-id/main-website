import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah, getCoverImage, getTemplateBySlug, templates, tierLabels } from "@/lib/templates";
import { getSchema } from "@/lib/order-schema";
import OrderForm from "./OrderForm";

export function generateStaticParams() {
  return templates.map((t) => ({ templateSlug: t.slug }));
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;
  const template = getTemplateBySlug(templateSlug);
  const schema = getSchema(templateSlug);

  if (!template || !schema) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Link
        href={"/template/" + template.slug}
        className="text-sm font-medium text-text-muted hover:text-text"
      >
        Kembali ke detail template
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-primary/12 bg-surface">
            <div className="relative aspect-[4/3] bg-bg">
              <Image
                src={getCoverImage(template)}
                alt={template.name}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-display text-lg font-semibold text-text">{template.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
                {tierLabels[template.tier]}
              </p>
              <p className="mt-4 font-display text-2xl font-semibold text-text">
                {formatRupiah(template.price)}
              </p>
              <p className="text-xs text-text-muted line-through">
                {formatRupiah(template.originalPrice)}
              </p>
            </div>
          </div>
        </aside>

        <div>
          <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
            Pesan {template.name}
          </h1>
          <p className="mt-2 text-text-muted">
            Isi datanya di bawah. Pembayaran dan pengiriman foto dilakukan lewat WhatsApp
            setelah ini.
          </p>

          <div className="mt-8">
            <OrderForm
              templateSlug={template.slug}
              schema={schema}
              photoCount={template.photoCount}
              supportsMusic={template.supportsMusic}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
