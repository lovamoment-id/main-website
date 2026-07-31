import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderBySlug } from "@/lib/orders";
import { formatRupiah, getTemplateBySlug } from "@/lib/templates";
import { waLink } from "@/lib/whatsapp";

// Reads a row that was written moments ago, so it must never be prerendered.
export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderSlug: string }>;
}) {
  const { orderSlug } = await params;
  const order = await getOrderBySlug(orderSlug);

  if (!order) {
    notFound();
  }

  const template = getTemplateBySlug(order.template_slug);
  const templateName = template?.name ?? order.template_slug;
  const price = order.price_idr ?? template?.price ?? 0;

  // Buyers who used the upload fields have nothing left to send but the
  // transfer receipt, so telling them to send photos over chat would be wrong.
  const payload = (order.payload ?? {}) as Record<string, unknown>;
  const hasUploads =
    typeof payload.assetFolder === "string" && payload.assetFolder.length > 0;

  const waMessage =
    "Halo Lovamoment.id, aku baru pesan " +
    templateName +
    " dengan kode order " +
    order.order_slug +
    (hasUploads
      ? ". Aku mau kirim bukti transfer."
      : ". Aku mau kirim foto, musik, dan bukti transfer.");

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <div className="rounded-3xl border border-primary/12 bg-surface p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Pesanan tersimpan
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-text">
          Tinggal satu langkah lagi
        </h1>
        <p className="mt-3 leading-relaxed text-text-muted">
          Simpan kode pesanan ini. Sebutkan saat menghubungi kami supaya lebih cepat kami
          proses.
        </p>

        <div className="mt-6 rounded-2xl bg-bg p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Kode pesanan</p>
          <p className="mt-1 font-mono text-xl font-semibold text-text">{order.order_slug}</p>

          <div className="mt-4 flex items-baseline justify-between border-t border-primary/10 pt-4">
            <span className="text-sm text-text-muted">{templateName}</span>
            <span className="font-display text-2xl font-semibold text-text">
              {formatRupiah(price)}
            </span>
          </div>
        </div>

        {hasUploads && (
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Foto dan musik yang kamu unggah sudah kami terima, jadi tidak perlu dikirim
            ulang lewat WhatsApp.
          </p>
        )}

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-text">Cara membayar</h2>
          <ol className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
            <li className="flex gap-3">
              <span className="font-display text-base font-semibold text-primary">1</span>
              <span>
                Transfer{" "}
                <span className="font-semibold text-text">{formatRupiah(price)}</span> ke
                rekening atau QRIS yang kami kirim lewat WhatsApp.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-base font-semibold text-primary">2</span>
              <span>
                Kirim <span className="font-semibold text-text">bukti transfer</span> ke
                WhatsApp yang sama.
                {!hasUploads &&
                  " Sertakan juga foto dan lagu yang mau dipakai, kalau template ini memerlukannya."}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-base font-semibold text-primary">3</span>
              <span>
                Kami siapkan link personalmu, lalu kirimkan ke WhatsApp kamu. Biasanya dalam
                hitungan jam di hari yang sama.
              </span>
            </li>
          </ol>
        </section>

        <a
          href={waLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 block rounded-full bg-primary px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Lanjut ke WhatsApp
        </a>

        <p className="mt-4 text-center text-xs text-text-muted">
          Tombol di atas sudah membawa kode pesananmu, jadi tidak perlu mengetik ulang.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-text-muted">
        <Link href="/gallery" className="font-medium text-primary hover:text-primary/80">
          Lihat template lainnya
        </Link>
      </p>
    </div>
  );
}
