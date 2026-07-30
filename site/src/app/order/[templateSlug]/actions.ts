"use server";

import { redirect } from "next/navigation";
import { createOrder } from "@/lib/orders";
import { getSchema } from "@/lib/order-schema";
import { getTemplateBySlug } from "@/lib/templates";

export type OrderFormState = { error: string | null };

/** Indonesian mobile numbers, normalised to the 628... form wa.me expects. */
function normaliseWhatsapp(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 9 || digits.length > 15) return null;

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export async function submitOrder(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const templateSlug = String(formData.get("templateSlug") ?? "");

  // Price comes from the server side catalogue, never from the form, so a
  // tampered field cannot buy an Exclusive template at Classic price.
  const template = getTemplateBySlug(templateSlug);
  const schema = getSchema(templateSlug);
  if (!template || !schema) {
    return { error: "Template tidak ditemukan." };
  }

  const customerName = String(formData.get("customerName") ?? "").trim();
  const whatsappRaw = String(formData.get("customerWhatsapp") ?? "").trim();
  const customSlug = String(formData.get("customSlug") ?? "").trim();

  if (!customerName || !whatsappRaw) {
    return { error: "Nama dan nomor WhatsApp kamu wajib diisi." };
  }

  const customerWhatsapp = normaliseWhatsapp(whatsappRaw);
  if (!customerWhatsapp) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  }

  // Collect the answers this template actually asks for. Anything not in the
  // schema is ignored rather than stored, so a crafted POST cannot smuggle
  // extra keys into the payload that later get written into CONFIG.
  const payload: Record<string, unknown> = {};

  for (const field of schema.fields) {
    const value = String(formData.get(field.name) ?? "").trim();

    if (field.required && !value) {
      return { error: field.label + " wajib diisi." };
    }
    if (field.maxLength && value.length > field.maxLength) {
      return { error: field.label + " terlalu panjang, maksimal " + field.maxLength + " karakter." };
    }
    // The 3D scenes only have room for a few words in the middle of the model.
    if (field.name === "centerText" && value && countWords(value) > 4) {
      return { error: "Ucapan di tengah maksimal 4 kata." };
    }
    if (value) payload[field.name] = value;
  }

  for (const group of schema.groups ?? []) {
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < group.count; i++) {
      const row: Record<string, string> = {};
      for (const field of group.fields) {
        const key = group.name + "." + i + "." + field.name;
        const value = String(formData.get(key) ?? "").trim();
        if (field.required && !value) {
          return { error: group.label + " " + (i + 1) + ": " + field.label + " wajib diisi." };
        }
        if (field.maxLength && value.length > field.maxLength) {
          return {
            error: group.label + " " + (i + 1) + ": " + field.label + " terlalu panjang.",
          };
        }
        row[field.name] = value;
      }
      rows.push(row);
    }
    payload[group.name] = rows;
  }

  let orderSlug: string;
  try {
    orderSlug = await createOrder({
      templateSlug: template.slug,
      customerName,
      customerWhatsapp,
      priceIdr: template.price,
      payload,
      customSlug: customSlug || undefined,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    return { error: "Pesanan gagal disimpan. " + detail };
  }

  // redirect throws, so it must sit outside the try above or it would be
  // swallowed and reported as a save failure.
  redirect("/order/konfirmasi/" + orderSlug);
}
