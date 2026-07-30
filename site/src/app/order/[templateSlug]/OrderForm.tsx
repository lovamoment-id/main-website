"use client";

import { useActionState } from "react";
import type { Field, TemplateSchema } from "@/lib/order-schema";
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
  photoCount,
  supportsMusic,
}: {
  templateSlug: string;
  schema: TemplateSchema;
  photoCount: number;
  supportsMusic: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, INITIAL);

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

      <div className="rounded-2xl border border-primary/12 bg-surface p-5 text-sm text-text-muted">
        <p className="font-medium text-text">Foto dan musik dikirim lewat WhatsApp</p>
        <p className="mt-1.5 leading-relaxed">
          {schema.photos
            ? schema.photos.help + " "
            : (schema.groups ?? []).some((g) => g.withPhoto)
              ? "Satu foto untuk tiap bagian di atas. "
              : ""}
          {photoCount > 0 || (schema.groups ?? []).some((g) => g.withPhoto)
            ? "Kami akan meminta fotonya lewat chat setelah pesanan ini masuk. "
            : ""}
          {supportsMusic && schema.musicHelp}
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
