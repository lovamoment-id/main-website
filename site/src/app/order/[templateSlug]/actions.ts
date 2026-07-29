"use server";

import { redirect } from "next/navigation";
import { createOrder } from "@/lib/orders";
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

export async function submitOrder(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const templateSlug = String(formData.get("templateSlug") ?? "");

  // Price comes from the server side catalogue, never from the form, so a
  // tampered field cannot buy an Exclusive template at Classic price.
  const template = getTemplateBySlug(templateSlug);
  if (!template) {
    return { error: "Template tidak ditemukan." };
  }

  const customerName = String(formData.get("customerName") ?? "").trim();
  const whatsappRaw = String(formData.get("customerWhatsapp") ?? "").trim();
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const senderName = String(formData.get("senderName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!customerName || !whatsappRaw || !recipientName || !senderName || !message) {
    return { error: "Semua kolom bertanda wajib harus diisi." };
  }

  const customerWhatsapp = normaliseWhatsapp(whatsappRaw);
  if (!customerWhatsapp) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  }

  let orderSlug: string;
  try {
    orderSlug = await createOrder({
      templateSlug: template.slug,
      customerName,
      customerWhatsapp,
      priceIdr: template.price,
      payload: {
        recipientName,
        senderName,
        message,
        notes: notes || undefined,
      },
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    return { error: "Pesanan gagal disimpan. " + detail };
  }

  // redirect throws, so it must sit outside the try above or it would be
  // swallowed and reported as a save failure.
  redirect("/order/konfirmasi/" + orderSlug);
}
