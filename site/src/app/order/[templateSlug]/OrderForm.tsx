"use client";

import { useActionState } from "react";
import { submitOrder, type OrderFormState } from "./actions";

const INITIAL: OrderFormState = { error: null };

const fieldClass =
  "rounded-xl border border-primary/20 bg-surface px-4 py-3 text-text outline-none focus:border-primary/50";

export default function OrderForm({
  templateSlug,
  photoCount,
  supportsMusic,
}: {
  templateSlug: string;
  photoCount: number;
  supportsMusic: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="templateSlug" value={templateSlug} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Nama kamu</span>
          <input name="customerName" required maxLength={80} className={fieldClass} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">WhatsApp kamu</span>
          <input
            name="customerWhatsapp"
            required
            inputMode="tel"
            placeholder="081234567890"
            className={fieldClass}
          />
          <span className="text-xs text-text-muted">
            Link jadi akan kami kirim ke nomor ini.
          </span>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Nama penerima</span>
          <input name="recipientName" required maxLength={40} className={fieldClass} />
          <span className="text-xs text-text-muted">Nama yang muncul di template.</span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Nama pengirim</span>
          <input name="senderName" required maxLength={40} className={fieldClass} />
          <span className="text-xs text-text-muted">Nama di tanda tangan.</span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Pesan atau isi surat</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={2000}
          className={fieldClass + " resize-y"}
        />
        <span className="text-xs text-text-muted">
          Tulis apa adanya. Kami rapikan tata letaknya, tanpa mengubah maknanya.
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">
          Catatan tambahan <span className="font-normal text-text-muted">(opsional)</span>
        </span>
        <textarea name="notes" rows={3} maxLength={1000} className={fieldClass + " resize-y"} />
      </label>

      <div className="rounded-2xl border border-primary/12 bg-surface p-5 text-sm text-text-muted">
        <p className="font-medium text-text">Foto dan musik dikirim lewat WhatsApp</p>
        <p className="mt-1.5 leading-relaxed">
          Setelah pesanan ini masuk, kami akan minta
          {photoCount > 0 ? " " + photoCount + " foto" : " berkasnya"}
          {supportsMusic ? " dan satu lagu" : ""} lewat chat. Cara ini lebih mudah daripada
          upload di sini, dan kamu bisa langsung tanya kalau ragu.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Kirim Pesanan"}
      </button>
    </form>
  );
}
