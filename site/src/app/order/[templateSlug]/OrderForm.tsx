"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Field, TemplateSchema } from "@/lib/order-schema";
import FileSlots, { type PickedFiles } from "./FileSlots";
import { submitOrder, type OrderFormState } from "./actions";

const INITIAL: OrderFormState = { error: null };

const fieldClass =
  "rounded-xl border border-primary/20 bg-surface px-4 py-3 text-text outline-none focus:border-primary/50";

function Label({ field }: { field: Field }) {
  return (
    <span className="text-sm font-medium text-text">
      {field.label}
      {!field.required && <span className="font-normal text-text-muted"> (opsional)</span>}
    </span>
  );
}

function FieldInput({ field, name }: { field: Field; name: string }) {
  const shared = {
    name,
    required: field.required,
    maxLength: field.maxLength,
    placeholder: field.placeholder,
    className: fieldClass,
  };

  if (field.kind === "textarea" || field.kind === "letter") {
    return <textarea {...shared} rows={field.kind === "letter" ? 8 : 4} className={fieldClass + " resize-y"} />;
  }
  if (field.kind === "date") {
    return <input {...shared} type="date" />;
  }
  if (field.kind === "select") {
    return (
      <select name={name} required={field.required} className={fieldClass}>
        {(field.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  return <input {...shared} type="text" />;
}

function FieldRow({ field, name }: { field: Field; name: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label field={field} />
      <FieldInput field={field} name={name} />
      {field.help && <span className="text-xs text-text-muted">{field.help}</span>}
    </label>
  );
}

export default function OrderForm({
  templateSlug,
  schema,
  supportsMusic,
}: {
  templateSlug: string;
  schema: TemplateSchema;
  supportsMusic: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, INITIAL);
  const router = useRouter();

  const [picked, setPicked] = useState<PickedFiles>({ photos: [], music: null });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  // The action deliberately returns tickets instead of redirecting, because the
  // bytes cannot travel through it. Once tickets arrive, push each file straight
  // to Supabase, then move on to the confirmation page.
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!state.ok || !state.orderSlug) return;
    if (handled.current === state.orderSlug) return; // guard against re-runs
    handled.current = state.orderSlug;

    const tickets = state.tickets ?? [];
    const slug = state.orderSlug;

    async function run() {
      if (tickets.length === 0) {
        router.push("/order/konfirmasi/" + slug);
        return;
      }

      setUploading(true);
      setProgress({ done: 0, total: tickets.length });

      const bySlot = new Map<string, File>();
      picked.photos.forEach((f, i) => bySlot.set("photo" + i, f));
      if (picked.music) bySlot.set("music", picked.music);

      let done = 0;
      for (const ticket of tickets) {
        const file = bySlot.get(ticket.slot);
        if (!file) continue;
        try {
          const res = await fetch(ticket.signedUrl, {
            method: "PUT",
            headers: { "content-type": file.type || "application/octet-stream" },
            body: file,
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
        } catch {
          // The order row already exists, so the buyer is not stuck: tell them
          // what happened and let the admin collect the file over chat.
          setUploading(false);
          setUploadError(
            "Pesanan tersimpan, tapi ada berkas yang gagal diunggah. Lanjut saja, nanti kami minta lewat WhatsApp.",
          );
          setTimeout(() => router.push("/order/konfirmasi/" + slug), 2500);
          return;
        }
        done++;
        setProgress({ done, total: tickets.length });
      }

      router.push("/order/konfirmasi/" + slug);
    }

    void run();
  }, [state.ok, state.orderSlug, state.tickets, picked, router]);

  const busy = pending || uploading;
  const maxPhotos = schema.photos
    ? schema.photos.max
    : (schema.groups ?? []).filter((g) => g.withPhoto).reduce((a, g) => a + g.count, 0);
  const photoHelp = schema.photos
    ? schema.photos.help
    : (schema.groups ?? []).some((g) => g.withPhoto)
      ? "Satu foto untuk tiap bagian di atas, sesuai urutannya."
      : "";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="templateSlug" value={templateSlug} />

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-2 font-display text-lg font-semibold text-text">Data kamu</legend>
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
            <span className="text-xs text-text-muted">Link jadi akan kami kirim ke nomor ini.</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5 border-t border-primary/10 pt-6">
        <legend className="mb-2 font-display text-lg font-semibold text-text">Isi hadiahmu</legend>
        {schema.fields.map((field) => (
          <FieldRow key={field.name} field={field} name={field.name} />
        ))}
      </fieldset>

      {(schema.groups ?? []).map((group) => (
        <fieldset key={group.name} className="flex flex-col gap-5 border-t border-primary/10 pt-6">
          <legend className="mb-2 font-display text-lg font-semibold text-text">{group.label}</legend>
          {group.help && <p className="-mt-3 text-xs text-text-muted">{group.help}</p>}
          {Array.from({ length: group.count }, (_, i) => (
            <div key={i} className="rounded-2xl border border-primary/12 bg-surface p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                {group.label} {i + 1}
                {group.withPhoto && <span className="ml-2 font-normal text-text-muted">foto ke-{i + 1}</span>}
              </p>
              <div className="flex flex-col gap-4">
                {group.fields.map((field) => (
                  <FieldRow
                    key={field.name}
                    field={field}
                    name={group.name + "." + i + "." + field.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </fieldset>
      ))}

      <fieldset className="flex flex-col gap-5 border-t border-primary/10 pt-6">
        <legend className="mb-2 font-display text-lg font-semibold text-text">Alamat halaman</legend>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">
            Nama halaman <span className="font-normal text-text-muted">(opsional)</span>
          </span>
          <div className="flex items-center gap-1 rounded-xl border border-primary/20 bg-surface px-4 py-3">
            <span className="shrink-0 text-sm text-text-muted">lovamoment.id/v/</span>
            <input
              name="customSlug"
              maxLength={40}
              placeholder="zia-dan-leo"
              className="min-w-0 flex-1 bg-transparent text-text outline-none"
            />
          </div>
          <span className="text-xs text-text-muted">
            Huruf besar otomatis jadi kecil dan spasi jadi tanda hubung. Kosongkan dan kami
            buatkan alamat acak.
          </span>
        </label>
      </fieldset>

      <FileSlots
        maxPhotos={maxPhotos}
        minPhotos={schema.photos?.min ?? 0}
        photoHelp={photoHelp}
        supportsMusic={supportsMusic}
        musicHelp={schema.musicHelp}
        onChange={setPicked}
        disabled={busy}
      />

      {state.error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {state.error}
        </p>
      )}
      {uploadError && (
        <p role="alert" className="text-sm font-medium text-primary">
          {uploadError}
        </p>
      )}

      {uploading && progress.total > 0 && (
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="text-sm text-text-muted">
            Mengunggah berkas {progress.done} dari {progress.total}...
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: Math.round((progress.done / progress.total) * 100) + "%" }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : uploading ? "Mengunggah berkas..." : "Kirim Pesanan"}
      </button>
    </form>
  );
}
