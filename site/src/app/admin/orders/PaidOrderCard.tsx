"use client";

import { useState } from "react";
import type { OrderRow } from "@/lib/supabase";

export default function PaidOrderCard({
  order,
  templateName,
}: {
  order: OrderRow;
  templateName: string;
}) {
  const [copied, setCopied] = useState(false);
  const path = "/v/" + order.order_slug;

  async function copyLink() {
    // window.location.origin keeps this correct on localhost, on the Vercel
    // preview domain, and on lovamoment.id without hardcoding any of them.
    const full = window.location.origin + path;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard needs a secure context and permission; if it is refused the
      // link is still visible and selectable below.
      setCopied(false);
    }
  }

  return (
    <article className="rounded-2xl border border-primary/12 bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-text">{templateName}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {order.customer_name ?? "Tanpa nama"}
            {order.paid_at
              ? " . aktif sejak " + new Date(order.paid_at).toLocaleString("id-ID")
              : ""}
          </p>
        </div>
        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Aktif
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 truncate rounded-xl bg-bg px-4 py-2.5 font-mono text-xs text-text hover:text-primary"
        >
          {path}
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 rounded-full border border-primary/25 px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-primary/40"
        >
          {copied ? "Tersalin" : "Salin link"}
        </button>
      </div>
    </article>
  );
}
