"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderRow } from "@/lib/supabase";

export default function PendingOrderCard({
  order,
  templateName,
  priceLabel,
}: {
  order: OrderRow;
  templateName: string;
  priceLabel: string;
}) {
  const router = useRouter();
  const [assetBase, setAssetBase] = useState(order.asset_base ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders/" + order.id + "/mark-paid", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assetBase }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Gagal mengaktifkan pesanan.");
        return;
      }
      router.refresh();
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setBusy(false);
    }
  }

  const waDigits = (order.customer_whatsapp ?? "").replace(/[^0-9]/g, "");

  return (
    <article className="rounded-2xl border border-primary/12 bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-text">{templateName}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Kode order: <span className="font-mono text-text">{order.order_slug}</span>
          </p>
        </div>
        <span className="rounded-full bg-accent/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text">
          Menunggu
        </span>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Pemesan</dt>
          <dd className="text-text">{order.customer_name ?? "Tidak diisi"}</dd>
        </div>
        <div>
          <dt className="text-text-muted">WhatsApp</dt>
          <dd className="text-text">
            {waDigits ? (
              <a
                href={"https://wa.me/" + waDigits}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary/80"
              >
                {order.customer_whatsapp}
              </a>
            ) : (
              "Tidak diisi"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Harga</dt>
          <dd className="text-text">{priceLabel}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Masuk</dt>
          <dd className="text-text">
            {new Date(order.created_at).toLocaleString("id-ID")}
          </dd>
        </div>
      </dl>

      {order.payload && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Isi pesanan
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-bg p-4 text-xs leading-relaxed text-text">
            {JSON.stringify(order.payload, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 border-t border-primary/10 pt-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">
            Asset base (URL folder aset pembeli)
          </span>
          <input
            type="url"
            inputMode="url"
            value={assetBase}
            onChange={(e) => setAssetBase(e.target.value)}
            placeholder="https://contoh.supabase.co/storage/v1/object/public/orders/kode-order/"
            className="rounded-xl border border-primary/20 bg-bg px-4 py-3 font-mono text-xs text-text outline-none focus:border-primary/50"
          />
          <span className="text-xs text-text-muted">
            Template menyusun URL sebagai asset base ditambah image1.jpg, jadi ini harus
            menunjuk ke folder. Garis miring di akhir ditambahkan otomatis kalau lupa.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-primary">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={activate}
          disabled={busy || assetBase.trim().length === 0}
          className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? "Memproses..." : "Tandai Lunas & Aktifkan"}
        </button>
      </div>
    </article>
  );
}
